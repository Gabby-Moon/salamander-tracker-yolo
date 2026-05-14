/**
 *  A function to show a preview of the binarized video results represented as black and white with the centroid of the largest figure marked.
 */

/**
 * Reformats the hex string from the color picker as RGB
 * 
 * @param {string} hex 
 * @returns {{ r: number, g: number, b: number }} Object representing the rgb colors
 */
function hexToRGB(hex) {
    const clean = hex.startsWith("#") ? hex.slice(1) : hex;
    const arr = [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16)
    ];
    return Object.assign(arr, { r: arr[0], g: arr[1], b: arr[2] });
}

/**
 * Converts an image blob into a HTMLCanvasElement by drawing it onto a 2D canvas.
 * 
 * @param {Blob} blob 
 * @returns {Promise<HTMLCanvasElement>} A promise that resolve to a canvas that contains the rendered image
 */
async function drawImageToCanvas(blob) {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    return canvas;
}
/**
 * Converts an image canvas to black and white by applying a threshold based on
 * the Euclidean color-distance between each pixel and a target color.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas containing the image to convert.
 * @param {string} targetHex - The target color in hex format (e.g., "#ffffff").
 * @param {number} threshold - Maximum allowed color distance before a pixel becomes black.
 */
function convertCanvasToBW(canvas, targetHex, threshold) {
    const ctx = canvas.getContext("2d");
    const { data, width: w, height: h } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const [tr, tg, tb] = hexToRGB(targetHex);

    for (let i = 0; i < data.length; i += 4) { // each pixel is represented by 4 spots in the canvas array (r,g,b,a)
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt(Math.pow(tr-r,2)+Math.pow(tg-g,2)+Math.pow(tb-b,2))

        const value = dist <= threshold ? 255 : 0; //if the pixel is above the threshold, set the rgb to 255 (white)

        data[i] = data[i + 1] = data[i + 2] = value; //rgb
        data[i + 3] = 255; // alpha channel fully opaque
    }

    ctx.putImageData(new ImageData(data, w, h), 0, 0); // write the modified data to the canvas
}

/**
 * Indicates the centroid on the canvas (ctx) at the x and y coordinates in lime green as a circle
 * 
 * @param {HTMLCanvasElement} ctx - 
 * @param {number} x 
 * @param {number} y 
 */
function drawCentroid(ctx, x, y) {
    ctx.save()
    ctx.strokeStyle = "lime";      // green
    ctx.lineWidth = 3;

    ctx.beginPath()
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
}

/**
 * Performs a dfs search on the white pixels on a black and white canvas to locate the largest cohesive group and then marks 
 * the centroid of that group with * a green circle
 * 
 * @param {HTMLCanvasElement} canvas - A black and white canvas preprocessed with convertCanvasToBW
 * @return - returns without updating if there is no centroid
 */
function markLargestComponentCentroid(canvas) {
    const ctx = canvas.getContext("2d");
    const { data, width: w, height: h } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Uint8Array is 8 bit array
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < data.length; i += 4) {
        mask[i / 4] = data[i] === 255 ? 1 : 0;
    }

    // 4-direction flood fill to find largest component
    const visited = new Uint8Array(w * h);
    let largest = [];
    const stack = [];
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

    // index calculator (canvas elements are represented as a 1D array with 4 indexes per pixel [r,g,b,a,r,g,b,a,...].
    // Element width/height property determines where pixels wrap on screen
    const index = (x, y) => y * w + x;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const curPixel = index(x, y);
            if (mask[curPixel] && !visited[curPixel]) {
                stack.length = 0;
                const component = [];
                stack.push([x, y]);
                visited[curPixel] = 1;

                while (stack.length) {
                    const [cx, cy] = stack.pop();
                    component.push([cx, cy]);
                    for (const [dx, dy] of dirs) {
                        const nx = cx + dx;
                        const ny = cy + dy;
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                            const ni = index(nx, ny);
                            if (mask[ni] && !visited[ni]) {
                                visited[ni] = 1;
                                stack.push([nx, ny]);
                            }
                        }
                    }
                }

                if (component.length > largest.length) largest = component;
            }
        }
    }

    if (largest.length === 0) return; // nothing to mark if there is no largest element

    // Compute centroid by adding up the x and y coordinates separately with reduce and then returning an array in the format [sumX, sumY]
    // if there are no coordinates, returns [0, 0]
    const sum = largest.reduce((acc, [x, y]) => { acc[0]+=x; acc[1]+=y; return acc; }, [0,0]);
    const cx = Math.round(sum[0]/largest.length);
    const cy = Math.round(sum[1]/largest.length);

    // Draw X at centroid
    drawCentroid(ctx, cx, cy)
}

/**
 * Processes an image Blob by converting it to a canvas, transforming it to black and white
 * based on a target color and threshold, marking the largest connected component's centroid,
 * and returning the final image as a JPEG data URL.
 * @param {Blob} blob - a blob representing the jpeg to be processed (thumbnail)
 * @param {string} targetHex - the target color code in hex format to be converted to white pixels
 * @param {number} threshold - the Euclidean color distance threshold for the B/W conversion
 * @returns {Promise<string>} A promise that resolves to a JPEG url for the processed image
 */
export default async function processImage(blob, targetHex, threshold) {
    const canvas = await drawImageToCanvas(blob);
    convertCanvasToBW(canvas, targetHex, threshold);
    markLargestComponentCentroid(canvas);
    return canvas.toDataURL("image/jpeg");
}