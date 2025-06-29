from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient, errors
from bson import ObjectId
import joblib
import os
import logging
import uvicorn

# --- Configuración ---
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/produccion?authSource=admin")
DB_NAME = "produccion"
COL_PRODUCCION = "estuches"
COL_PROBLEMAS = "problemas"

# --- Inicializar FastAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configurar Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    hora: str
    linea: str
    uc_planificado: int
    nro_caja: int
    uc_real: int
    observaciones: Optional[str] = None

class Problema(BaseModel):
    descripcion: str
    responsable: str
    fecha: str
    status: str

class PrediccionInput(BaseModel):
    hora: str
    linea: str
    dia_semana: int
    turno: int

# --- Endpoints API ---
@app.get("/")
def home():
    return {"mensaje": "API de Producción de Estuches funcionando correctamente."}

@app.post("/produccion")
def registrar_produccion(data: ProduccionHora):
    result = db[COL_PRODUCCION].insert_one(data.dict())
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
    

# --- Mantener el servidor escuchando ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

