from fastapi import FastAPI

app = FastAPI(title="Axiom Sovereign API")

@app.get("/")
def read_root():
    return {"status": "Sovereign"}
