from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)


@app.route("/process_image", methods=["POST"])
def process_image():
    data = request.json
    image_data = data.get("image")
    coordinates = data.get("coordinates")

    if not image_data or not coordinates:
        return jsonify({"error": "Missing image data or coordinates"}), 400

    try:
        image_data = image_data.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))

        # TODO: Integrate SAM2 model here

        result = {
            "message": "Image received and coordinates processed",
        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
