from fastapi import FastAPI, HTTPException
from fastapi import WebSocket, WebSocketDisconnect
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient, errors
from bson import ObjectId
#import joblib
import os
import logging
import uvicorn
import asyncio
from fastapi.middleware.cors import CORSMiddleware

# --- Configuración ---
MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo_user:dobleq3@localhost:27017/mi_basedatos")
DB_NAME = "mi_basedatos"
COL_PRODUCCION = "estuches"
COL_PROBLEMAS = "problemas"

# --- Inicializar FastAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
      "https://5173-dobleq3-packing-j61l7t80bgf.ws-us120.gitpod.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configurar Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

clientes_websocket = []

# --- Conexión a MongoDB ---
try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    client.server_info()  # Forzar conexión
    db = client[DB_NAME]
    logger.info(f"Conectado exitosamente a MongoDB en {MONGO_URL}, usando base de datos '{DB_NAME}'")
except errors.ServerSelectionTimeoutError as err:
    logger.error("Error al conectar con MongoDB: %s", err)
    raise HTTPException(status_code=500, detail="No se pudo conectar con la base de datos")

# --- Modelos Pydantic ---
class ProduccionHora(BaseModel):
    nombre_producto: str
    es_problema: bool
    hora: str
    linea: str
    uc_planificado: int
    nro_caja: int
    uc_real: int
    observaciones: Optional[str] = None
    fecha_registro: Optional[str] = None
    hora_registro: Optional[str] = None

class Problema(BaseModel):
    descripcion: str
    responsable: str
    fecha: str
    status: str
    fecha_registro: Optional[str] = None
    hora_registro: Optional[str] = None

class PrediccionInput(BaseModel):
    hora: str
    linea: str
    dia_semana: int
    turno: int

# --- Endpoints API ---
@app.get("/")
def home():
    return {"mensaje": "API de Producción de Estuches funcionando correctamente."}

"""@app.post("/produccion")
def registrar_produccion(data: ProduccionHora):
    print(data)
    result = db[COL_PRODUCCION].insert_one(data.dict())
    return {"id": str(result.inserted_id)}"""

@app.post("/produccion")
async def registrar_produccion(data: ProduccionHora):
    print(data)
    result = db[COL_PRODUCCION].insert_one(data.dict())

    mensaje = {
        "timestamp": data.fecha_registro + "T" + (data.hora_registro or "00:00") + ":00Z",
        "uc_real": data.uc_real,
        "uc_planificado": data.uc_planificado,
        "linea": data.linea,
        "nro_caja": data.nro_caja
    }

    for ws in clientes_websocket.copy():
        try:
            await ws.send_text(json.dumps(mensaje))
        except Exception:
            clientes_websocket.remove(ws)

    return {"id": str(result.inserted_id)}


@app.get("/produccion")
def obtener_produccion():
    datos = list(db[COL_PRODUCCION].find())
    for d in datos:
        d["id"] = str(d["_id"])
        del d["_id"]
    return datos

@app.post("/problemas")
def registrar_problema(data: Problema):
    result = db[COL_PROBLEMAS].insert_one(data.dict())
    return {"id": str(result.inserted_id)}

@app.get("/problemas")
def obtener_problemas():
    datos = list(db[COL_PROBLEMAS].find())
    for d in datos:
        d["id"] = str(d["_id"])
        del d["_id"]
    return datos

@app.post("/predecir")
def predecir_uc(data: PrediccionInput):
    try:
        modelo = joblib.load("modelo_prediccion.pkl")
        entrada = [[data.dia_semana, data.turno]]
        uc_estimado = modelo.predict(entrada)
        return {"uc_estimado": int(uc_estimado[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")
    
    
@app.websocket("/ws/grafana")
async def websocket_grafana(websocket: WebSocket):
    await websocket.accept()
    clientes_websocket.append(websocket)

    try:
        while True:
            await asyncio.sleep(10)  # Mantiene la conexión viva pasivamente
    except WebSocketDisconnect:
        clientes_websocket.remove(websocket)    
    

# --- Mantener el servidor escuchando ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

