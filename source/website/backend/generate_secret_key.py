#!/usr/bin/env python
"""
Generate a new Django SECRET_KEY
Usage: python generate_secret_key.py
"""
from django.core.management.utils import get_random_secret_key

if __name__ == '__main__':
    print("Generated SECRET_KEY:")
    print(get_random_secret_key())
    print("\nCopy this to your Railway environment variables!")
