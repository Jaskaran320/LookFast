import numpy as np
import cv2
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor


def process_image_from_model(image, coordinates):
    try:
        input_point = np.array([[coordinates["x"], coordinates["y"]]])
        input_label = np.array([1])
        image_np = np.array(image.convert("RGB"), dtype=np.uint8)

        checkpoint = "sam2_hiera_small.pt"
        model_cfg = "sam2_hiera_s.yaml"
        predictor = SAM2ImagePredictor(build_sam2(model_cfg, checkpoint))
        predictor.set_image(image_np)

        masks, scores, logits = predictor.predict(
            point_coords=input_point,
            point_labels=input_label,
            multimask_output=True,
        )

        sorted_ind = np.argsort(scores)[::-1]
        masks = masks[sorted_ind]
        scores = scores[sorted_ind]
        logits = logits[sorted_ind]

        # masked_image = show_masks(image_np, masks[0], scores[0], point_coords=input_point, input_labels=input_label, borders=True)
        masked_image = draw_mask_on_image(image_np, masks[0])

        return masked_image

    except ValueError as e:
        raise ValueError(f"Error processing image: {str(e)}")
    except RuntimeError as e:
        raise RuntimeError(f"Error running the SAM2 model: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error occurred during image processing: {str(e)}")

def get_contrasting_color(image, mask):
    masked_region = cv2.bitwise_and(image, image, mask=mask)
    average_color = np.mean(masked_region, axis=(0, 1))
    
    luminance = 0.299 * average_color[2] + 0.587 * average_color[1] + 0.114 * average_color[0]
    
    if luminance > 127:
        return np.array([0, 0, 255])
    else:
        return np.array([0, 255, 255])

def draw_mask_on_image(image, mask, color = np.array([30/255, 144/255, 255/255, 0.6])):
    try:
        h, w = mask.shape
        mask = mask.astype(np.uint8)
        color = get_contrasting_color(image, mask)
        mask_image = np.zeros((h, w, 3), dtype=np.uint8)
        mask_image[mask > 0] = color
        masked_image = cv2.addWeighted(image, 1.0, mask_image, 0.5, 0)

        return masked_image

    except cv2.error as e:
        raise ValueError(f"Error drawing the mask on the image: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error occurred during mask drawing: {str(e)}")