import torch
import numpy as np
import cv2
from PIL import Image
import matplotlib.pyplot as plt
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


def draw_mask_on_image(image, mask, color=(30, 144, 255, 128)):
    try:
        image = cv2.cvtColor(image.astype(np.uint8), cv2.COLOR_RGB2RGBA)
        mask_image = np.zeros_like(image, dtype=np.uint8)
        mask_image[:, :, :3] = color[:3]
        mask_image[:, :, 3] = (mask * color[3]).astype(np.uint8)
        masked_image = cv2.addWeighted(image.astype(np.uint8), 1.0, mask_image.astype(np.uint8), 0.5, 0)

        return masked_image
    
    except cv2.error as e:
        raise ValueError(f"Error drawing the mask on the image: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error occurred during mask drawing: {str(e)}")


def show_mask(mask, ax, random_color=False, borders=True):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        color = np.array([30 / 255, 144 / 255, 255 / 255, 0.6])
    h, w = mask.shape[-2:]
    mask = mask.astype(np.uint8)
    mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    if borders:
        import cv2

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        # Try to smooth contours
        contours = [
            cv2.approxPolyDP(contour, epsilon=0.01, closed=True) for contour in contours
        ]
        mask_image = cv2.drawContours(
            mask_image, contours, -1, (1, 1, 1, 0.5), thickness=2
        )
    ax.imshow(mask_image)


def show_points(coords, labels, ax, marker_size=375):
    pos_points = coords[labels == 1]
    neg_points = coords[labels == 0]
    ax.scatter(
        pos_points[:, 0],
        pos_points[:, 1],
        color="green",
        marker="*",
        s=marker_size,
        edgecolor="white",
        linewidth=1.25,
    )
    ax.scatter(
        neg_points[:, 0],
        neg_points[:, 1],
        color="red",
        marker="*",
        s=marker_size,
        edgecolor="white",
        linewidth=1.25,
    )


def show_box(box, ax):
    x0, y0 = box[0], box[1]
    w, h = box[2] - box[0], box[3] - box[1]
    ax.add_patch(
        plt.Rectangle((x0, y0), w, h, edgecolor="green", facecolor=(0, 0, 0, 0), lw=2)
    )


def show_masks(
    image,
    masks,
    scores,
    point_coords=None,
    box_coords=None,
    input_labels=None,
    borders=True,
):
    for i, (mask, score) in enumerate(zip(masks, scores)):
        plt.figure(figsize=(10, 10))
        plt.imshow(image)
        show_mask(mask, plt.gca(), borders=borders)
        if point_coords is not None:
            assert input_labels is not None
            show_points(point_coords, input_labels, plt.gca())
        if box_coords is not None:
            # boxes
            show_box(box_coords, plt.gca())
        if len(scores) > 1:
            plt.title(f"Mask {i+1}, Score: {score:.3f}", fontsize=18)
        plt.axis("off")
        plt.show()
