import cv2
import numpy as np

img = cv2.imread('/home/aayush/.gemini/antigravity/brain/654bd510-91c0-4ad5-b98f-46e12c941988/chrome_list.png', cv2.IMREAD_GRAYSCALE)
# Find rectangles/cards
edges = cv2.Canny(img, 50, 150)
contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cards = 0
for c in contours:
    x,y,w,h = cv2.boundingRect(c)
    if w > 500 and h > 50:
        cards += 1
print(f"Found {cards} card-like contours in list mode")
