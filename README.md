# instructions
### Requirements
- python
- git
- next.js
- npm
### Setup
It is recommended to have two terminals up, one to fun the frontend and one for the backend; both terminals should be in the project folder.  

First in the frontend terminal run ```cd backend``` to go to the backend folder,
```python3 -m venv venv``` to make the folder for the environment,
Mac:```source venv/bin/activate``` Windows:```venv\Scripts\activate``` to run the environment. You should see (venv) before the new input if it ran correctly.  
Next in that environment run ```pip install -r requirements.txt```, all requirements are in the txt file. It will take some time before it's done, it could be a few minutes.  
After that is done, in the same environment run ```python main.py```, this will run the backend. You can check to make sure it's working by going to the localhost page, it should give you the number when it successfully runs.  

In the other terminal, run ```cd frontend``` to move to the frontend folder and run ```npm i``` to install the modules needed for the page to work. After, you should be able to run ```npm run dev``` and it will give you a localhost link to follow. Going to the link will take you to the page.

# Dataset & Training
A total of 240 images were labeled for this project. The dataset was compiled from two sources: frames extracted from the original salamander video, and additional salamander images sourced from the internet to improve diversity and generalization. All images were annotated using Label Studio.

The labeled dataset was then used to train a YOLO object detection model. Annotations were exported from Label Studio in YOLO-compatible format and used to tune the model to detect salamanders in video frames.

# Questions
## Comparison
For color masking the salamander would need to have a different color compared to the background, like a dark gray salamander on a green background. For Yolo detection it works better because it will know what a salamander looks like and will be able to tell it apart from a background of a similar color, based on features of the salamander. In a video with a dark red salamander and a red background, the Yolo model does better at detecting it if the contrast is too similar for the color masking to detect. The Yolo model will still detect it because of pattern recognition and the images it's trained from.

## More Time
