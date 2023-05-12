import time
from pynput import keyboard
from pynput.mouse import Controller

# Create an instance of the Mouse Controller
mouse = Controller()

# Set these flag variables to track the scroll state
scroll_enabled = False
activation_key = keyboard.Key.f9  # Change the activation key as needed
deactivation_key = keyboard.Key.f10  # Change the deactivation key as needed

# Callback function when a key is pressed
def on_press(key):
    global scroll_enabled
    if key == activation_key:
        scroll_enabled = True
        print("Scrolling activated")
    elif key == deactivation_key:
        scroll_enabled = False
        print("Scrolling deactivated")

# Scroll function
def scroll():
    mouse.scroll(0, -1)  # Scroll up one unit

# Create a listener for keyboard events
listener = keyboard.Listener(on_press=on_press)
listener.start()

# Main loop
while True:
    if scroll_enabled:
        scroll()
    time.sleep(0.1)  # Adjust the delay between scrolls as needed
