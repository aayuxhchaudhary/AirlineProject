from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1280,1024')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:5173/')
    time.sleep(2) # wait for load
    driver.save_screenshot('/home/aayush/.gemini/antigravity/brain/654bd510-91c0-4ad5-b98f-46e12c941988/chrome_list.png')
    
    # Click grid mode
    grid_btn = driver.find_element(By.XPATH, "//button[@aria-label='Grid view']")
    grid_btn.click()
    time.sleep(1)
    driver.save_screenshot('/home/aayush/.gemini/antigravity/brain/654bd510-91c0-4ad5-b98f-46e12c941988/chrome_grid.png')
finally:
    driver.quit()
