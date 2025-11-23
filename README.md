# **Nano-Banana-Pro-Sketch-Board**

A web-based sketching application that allows users to draw or sketch ideas on a canvas and transform them into generated images using Google's Gemini AI models. Sketches are sent along with text prompts to the API for image generation or editing, enabling creative workflows like concept visualization or style transfer.

- **Interactive Canvas**: Draw with customizable brush sizes (1-50px), colors (preset and custom), and an eraser tool. Supports mouse and touch input for desktop and mobile devices.
- **History Management**: Undo and redo actions with a full state history to revert or advance canvas changes.
- **AI Image Generation**: Integrate sketches with text prompts to generate or edit images using Gemini models.
- **Model Selection**: Choose between Gemini 2.5 Flash Image (free tier friendly) or Gemini 3 Pro Image Preview (may require paid access).
- **Theme Toggle**: Switch between light and dark modes for better usability.
- **Privacy-Focused**: API keys are stored only in session memory and cleared on page reload; no data is sent to external servers beyond the Gemini API.
- **Responsive Design**: Optimized for various screen sizes, with a scalable canvas (960x540 resolution, adjustable viewport).

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/2aae1f49-ccfa-4439-933c-a4c2df58dae2" width="32%" />
  <img src="https://github.com/user-attachments/assets/7db1549d-4bab-4986-8253-ba96876381fd" width="32%" />
  <img src="https://github.com/user-attachments/assets/df867ae5-e0ae-4ad9-ace8-f9280a11054a" width="32%" />

</p>

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/7a3486c7-1832-414f-a394-f1f87eebf359" width="24%" />
  <img src="https://github.com/user-attachments/assets/9b56b289-b740-4dcd-a170-7b8a985ac0a7" width="24%" />
  <img src="https://github.com/user-attachments/assets/7ae1fbaf-77c4-4c26-8970-c2afb5bfb786" width="24%" />
  <img src="https://github.com/user-attachments/assets/8c562f59-e689-4645-a88c-c82bd68bb5cc" width="24%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/8f2f4eca-80da-4258-b06d-01aa8b74a878" width="24%" />
  <img src="https://github.com/user-attachments/assets/a4f597fb-7f2f-4e69-b1ce-366467529b6e" width="24%" />
  <img src="https://github.com/user-attachments/assets/0b928aa9-e4dd-45b2-bff1-2a4844f8891c" width="24%" />
  <img src="https://github.com/user-attachments/assets/7055ecb3-1367-4d27-983f-e855bd914cbc" width="24%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a62de48d-a6d8-45e7-92f4-6606aa07a320" width="24%" />
  <img src="https://github.com/user-attachments/assets/c9d7f877-b3bf-4a13-b8d6-f74fcd6b1c08" width="24%" />
  <img src="https://github.com/user-attachments/assets/9a517154-40f3-4c71-bb55-596d86c7d9e8" width="24%" />
</p>

---

## Prerequisites

- Node.js (version 14 or higher) for local development.
- A Google Gemini API key (obtain from [Google AI Studio](https://aistudio.google.com/app/apikey)).
- Basic familiarity with React and npm/yarn for setup.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/PRITHIVSAKTHIUR/Nano-Banana-Pro-Sketch-Board.git
   cd Nano-Banana-Pro-Sketch-Board
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

The app will open at `http://localhost:3000`.

## Usage

1. **Drawing on Canvas**:
   - Use the brush tool to sketch ideas. Adjust size via the brush menu.
   - Select colors from presets or use the custom color picker.
   - Activate the eraser for corrections.
   - Use Undo/Redo buttons for navigation through drawing history.
   - Clear the canvas at any time to start fresh.

2. **AI Generation**:
   - Enter a descriptive prompt in the input field (e.g., "Transform this sketch into a realistic banana in a tropical setting").
   - On first use, provide your Gemini API key in the modal (it will be prompted if not set).
   - Submit to send the current canvas state (as a PNG) and prompt to the selected Gemini model.
   - The generated image replaces the canvas background, allowing further drawing or iterations.

3. **Model Switching**:
   - Open the model menu to toggle between Gemini 2.5 Flash Image (faster, lower cost) and Gemini 3 Pro Image Preview (higher quality, potential billing).

4. **Theme and Info**:
   - Toggle dark mode via the sun/moon icon.
   - View app details via the info button.

### API Key Management

- API keys are required for generation and are handled client-side only.
- Enter via the secure modal; keys are not persisted beyond the session.
- For Gemini 3 Pro, ensure your key is from a Google Cloud project with billing enabled if rate limits are hit.
- Errors (e.g., 403 Forbidden) are displayed with guidance; check console for details.

## Supported Models

| Model Name              | Description                          | Access Notes                  |
|-------------------------|--------------------------------------|-------------------------------|
| gemini-2.5-flash-image | Fast generation with image input support | Free tier available          |
| gemini-3-pro-image-preview | Advanced quality for complex prompts | May require paid API access  |

## Troubleshooting

- **Canvas Scaling Issues**: Ensure the browser zoom is at 100% for accurate touch/mouse coordinates.
- **API Errors**:
  - 403: Verify API key permissions or switch to Flash model.
  - Network: Check internet connection; retries are manual.
- **Touch Devices**: Prevent default scrolling by enabling touch events (handled automatically).
- **Build for Production**: Run `npm run build` for a static deployable bundle.

## Contributing

Contributions are welcome! Fork the repo, create a feature branch, and submit a pull request with details on changes.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Built by [Prithiv Sakthi](https://huggingface.co/prithivMLmods). For inquiries, reach out via the repository issues.
