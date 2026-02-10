import tkinter as tk
from tkinter import messagebox
import os
import sys

# Try-Except block prevents "ImportError" red lines in IDE
try:
    from dotenv import load_dotenv  # type: ignore
    import requests  # type: ignore
    from PIL import Image, ImageTk  # type: ignore
except ImportError:
    import tkinter.messagebox
    tkinter.messagebox.showerror("Error", "Missing libraries. Run: pip install requests python-dotenv pillow")
    sys.exit(1)
from io import BytesIO

# Load Environment Variables
load_dotenv()
API_KEY = os.getenv('OPENWEATHER_API_KEY')

# Define Color Themes
THEMES = {
    'Clear': {'bg': '#87CEEB', 'fg': '#000000'},      # Sky Blue
    'Clouds': {'bg': '#778899', 'fg': '#FFFFFF'},     # Light Slate Gray
    'Rain': {'bg': '#4682B4', 'fg': '#FFFFFF'},       # Steel Blue
    'Drizzle': {'bg': '#B0C4DE', 'fg': '#000000'},    # Light Steel Blue
    'Thunderstorm': {'bg': '#483D8B', 'fg': '#FFFFFF'},# Dark Slate Blue
    'Snow': {'bg': '#F0F8FF', 'fg': '#000000'},       # Alice Blue
    'Mist': {'bg': '#708090', 'fg': '#FFFFFF'},       # Slate Gray
    'Fog': {'bg': '#708090', 'fg': '#FFFFFF'},
    'Haze': {'bg': '#F5F5DC', 'fg': '#000000'},       # Beige for haze
    'Default': {'bg': '#f0f0f0', 'fg': '#000000'}
}

class WeatherApp:
    def __init__(self, root):
        self.root = root
        self.current_icon_image = None # Initialize to fix linter error
        self.root.title("Weather App")
        self.root.geometry("400x500")
        self.root.resizable(False, False)

        # Default Style
        # NOTE: Python Tkinter does NOT use style.css. It uses these internal settings.
        self.current_theme = THEMES['Default']
        self.set_theme(self.current_theme)

        # Main Container (to center everything like the CSS version)
        self.container = tk.Frame(root, bg=self.current_theme['bg'])
        self.container.pack(expand=True, fill='both', padx=20, pady=20)

        # Search Frame
        self.search_frame = tk.Frame(self.container, bg=self.current_theme['bg'])
        self.search_frame.pack(pady=10)

        self.city_entry = tk.Entry(self.search_frame, font=("Arial", 14), width=20)
        self.city_entry.pack(side=tk.LEFT, padx=10)
        self.city_entry.bind('<Return>', self.get_weather) # Bind Enter key

        self.search_btn = tk.Button(self.search_frame, text="Search", command=self.get_weather)
        self.search_btn.pack(side=tk.LEFT)

        # Weather Info Frame
        self.info_frame = tk.Frame(self.container, bg=self.current_theme['bg'])
        self.info_frame.pack(pady=10, expand=True, fill='both')

        # Elements
        self.city_label = tk.Label(self.info_frame, text="", font=("Arial", 24, "bold"), bg=self.current_theme['bg'])
        self.city_label.pack(pady=(10, 5))

        self.icon_label = tk.Label(self.info_frame, bg=self.current_theme['bg'])
        self.icon_label.pack(pady=5)

        self.temp_label = tk.Label(self.info_frame, text="", font=("Arial", 48, "bold"), bg=self.current_theme['bg'])
        self.temp_label.pack(pady=5)

        self.desc_label = tk.Label(self.info_frame, text="", font=("Arial", 16), bg=self.current_theme['bg'])
        self.desc_label.pack(pady=5)

        # Details Frame (Humidity, Wind)
        self.details_frame = tk.Frame(self.info_frame, bg=self.current_theme['bg'])
        self.details_frame.pack(pady=20, fill='x', padx=40)

        self.humidity_label = tk.Label(self.details_frame, text="", font=("Arial", 12), bg=self.current_theme['bg'])
        self.humidity_label.pack(side=tk.LEFT, expand=True)

        self.wind_label = tk.Label(self.details_frame, text="", font=("Arial", 12), bg=self.current_theme['bg'])
        self.wind_label.pack(side=tk.RIGHT, expand=True)

    def set_theme(self, theme):
        self.root.configure(bg=theme['bg'])
        if hasattr(self, 'container'):
            self.container.configure(bg=theme['bg'])
        if hasattr(self, 'search_frame'):
            self.search_frame.configure(bg=theme['bg'])
        if hasattr(self, 'info_frame'):
            self.info_frame.configure(bg=theme['bg'])
            self.city_label.configure(bg=theme['bg'], fg=theme['fg'])
            self.temp_label.configure(bg=theme['bg'], fg=theme['fg'])
            self.desc_label.configure(bg=theme['bg'], fg=theme['fg'])
            self.icon_label.configure(bg=theme['bg'])
            self.details_frame.configure(bg=theme['bg'])
            self.humidity_label.configure(bg=theme['bg'], fg=theme['fg'])
            self.wind_label.configure(bg=theme['bg'], fg=theme['fg'])

    def get_weather(self, event=None):
        city = self.city_entry.get()
        if not city:
            messagebox.showwarning("Input Error", "Please enter a city name.")
            return

        if not API_KEY or API_KEY == "YOUR_API_KEY_HERE":
            messagebox.showerror("Configuration Error", "API Key is missing. Check .env file.")
            return

        api_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

        try:
            response = requests.get(api_url)
            response.raise_for_status()
            data = response.json()
            self.update_ui(data)
        except requests.exceptions.HTTPError as err:
            if response.status_code == 404:
                messagebox.showerror("Error", "City not found.")
            else:
                messagebox.showerror("Error", f"HTTP Error: {err}")
        except requests.exceptions.RequestException as err:
            messagebox.showerror("Error", f"Network Error: {err}")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")

    def update_ui(self, data):
        # Update Text
        self.city_label.config(text=f"{data['name']}, {data['sys']['country']}")
        self.temp_label.config(text=f"{int(data['main']['temp'])}°C")
        self.desc_label.config(text=data['weather'][0]['description'].title())
        self.humidity_label.config(text=f"Humidity: {data['main']['humidity']}%")
        self.wind_label.config(text=f"Wind: {data['wind']['speed']} m/s")

        # Update Theme
        main_weather = data['weather'][0]['main']
        # Map API weather string to our THEMES keys
        theme_key = 'Default'
        for key in THEMES:
            if key in main_weather:
                theme_key = key
                break
        
        self.current_theme = THEMES.get(theme_key, THEMES['Default'])
        self.set_theme(self.current_theme)

        # Update Icon
        icon_code = data['weather'][0]['icon']
        icon_url = f"http://openweathermap.org/img/wn/{icon_code}@2x.png"
        try:
            icon_response = requests.get(icon_url)
            icon_data = icon_response.content
            image = Image.open(BytesIO(icon_data))
            photo = ImageTk.PhotoImage(image)
            self.icon_label.config(image=photo)
            self.current_icon_image = photo # Stored in self to fix IDE warning
        except Exception:
            self.icon_label.config(image='', text="[Icon Fetch Failed]")

if __name__ == "__main__":
    print("Initializing Weather App...")
    try:
        root = tk.Tk()
        print("Window created.")
        app = WeatherApp(root)
        print("UI setup complete.")
        
        # Force window to top then release
        root.lift()
        root.attributes('-topmost',True)
        root.after_idle(root.attributes,'-topmost',False)
        
        print("Starting main loop... Check your taskbar for the Feather/Python icon.")
        root.mainloop()
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        input("Press Enter to exit...")
