from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
from model import process_image_from_model

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

        try:
            masked_image = process_image_from_model(image, coordinates)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except RuntimeError as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": "An unexpected error occurred during image processing"}), 500

        buffered = BytesIO()
        masked_image_pil = Image.fromarray(masked_image)
        masked_image_pil.save(buffered, format="PNG")
        masked_image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        result = {
            "message": "Image received and coordinates processed",
            "masked_image": "data:image/png;base64," + masked_image_base64
        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
