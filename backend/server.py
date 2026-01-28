"""
Minimal FastAPI Backend
This backend is not used by the UK Tax Calculator.
All calculations are performed client-side in the React frontend.

This file exists only to satisfy the Emergent platform requirements.
For static deployment (GitHub Pages, Netlify, Vercel), only the /app/frontend directory is needed.
"""

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "UK Tax Calculator - Frontend Only Application"}

@app.get("/health")
async def health():
    return {"status": "healthy", "note": "All calculations run in frontend"}
