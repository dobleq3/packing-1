db = db.getSiblingDB('mi_basedatos');

db.createUser({
  user: 'mongo_user',
  pwd: 'dobleq3',
  roles: [
    {
      role: 'readWrite',
      db: 'mi_basedatos',
    },
  ],
});
