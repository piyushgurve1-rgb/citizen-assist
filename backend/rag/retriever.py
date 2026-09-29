import chromadb
from sentence_transformers import SentenceTransformer
from pathlib import Path


# -----------------------------
# Paths
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent
VECTORSTORE_DIR = BASE_DIR / "vectorstore"


# -----------------------------
# Load embedding model
# -----------------------------

print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")


# -----------------------------
# Connect to ChromaDB
# -----------------------------

client = chromadb.PersistentClient(
    path=str(VECTORSTORE_DIR)
)

collection = client.get_collection(
    name="government_services"
)


# -----------------------------
# Retrieve relevant information
# -----------------------------

def retrieve_information(query, top_k=3):

    query_embedding = model.encode(
        [query]
    ).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )

    retrieved_documents = []

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):
        retrieved_documents.append(
            {
                "service": metadata.get("service"),
                "category": metadata.get("category"),
                "official_url": metadata.get("official_url"),
                "document": document,
                "distance": distance,
            }
        )

    return retrieved_documents


# -----------------------------
# Test retrieval
# -----------------------------

if __name__ == "__main__":

    query = "PM Kisan ke documents kya hain?"

    print()
    print("Query:", query)
    print()
    print("Searching RAG...")
    print()

    results = retrieve_information(query)

    for index, result in enumerate(results, start=1):

        print(f"Result {index}")
        print("-" * 40)

        print("Service:", result["service"])
        print("Category:", result["category"])
        print("Distance:", result["distance"])
        print()
        print(result["document"])
        print()