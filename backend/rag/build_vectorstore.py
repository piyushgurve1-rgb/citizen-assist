import json
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


# -----------------------------
# Paths
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "government_services.json"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"


# -----------------------------
# Load government services
# -----------------------------

with open(DATA_FILE, "r", encoding="utf-8") as file:
    services = json.load(file)


# -----------------------------
# Load embedding model
# -----------------------------

print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")


# -----------------------------
# Prepare documents
# -----------------------------

documents = []
metadatas = []
ids = []

for index, service in enumerate(services):
    documents.append(
        f"""
Service: {service['service']}
Category: {service['category']}

{service['content']}

Keywords: {', '.join(service.get('keywords', []))}
""".strip()
    )

    metadatas.append(
        {
            "service": service["service"],
            "category": service["category"],
            "official_url": service.get("official_url", ""),
        }
    )

    ids.append(f"service_{index}")


# -----------------------------
# Create embeddings
# -----------------------------

print("Creating embeddings...")

embeddings = model.encode(documents).tolist()


# -----------------------------
# Create ChromaDB
# -----------------------------

print("Creating vector store...")

client = chromadb.PersistentClient(
    path=str(VECTORSTORE_DIR)
)

collection = client.get_or_create_collection(
    name="government_services"
)


# -----------------------------
# Store documents
# -----------------------------

collection.upsert(
    ids=ids,
    documents=documents,
    embeddings=embeddings,
    metadatas=metadatas,
)


print()
print("RAG vector store created successfully.")
print(f"Documents stored: {collection.count()}")
print(f"Vector store location: {VECTORSTORE_DIR}")