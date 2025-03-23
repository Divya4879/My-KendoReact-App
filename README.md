# Academic Muse

Check it out at: [Academic Muse](https://academic-muse.netlify.app)

**Academic Muse** is a dynamic academic platform that tailors resources, assessments, and feedback to your educational level, empowering your learning journey. It also features a Pomodoro timer, smart reminders, and visual session tracking to boost productivity and progress.

![Project Image](https://github.com/user-attachments/assets/f9c6e5dd-6e0a-4469-a413-46b9fa9f705f)


---

## Project Overview

**Academic Muse** transforms how you access, synthesize, and retain knowledge. By offering tailored topic guides, interactive quizzes with in-depth feedback, and concise key takeaways aligned with your academic level, it revolutionizes your learning experience. With powerful time management tools like a Pomodoro Timer, customizable daily reminders, session logging with weekly visual insights, and same-day session scheduling with insistent alerts, Academic Muse provides a comprehensive solution for both research and daily study sessions.


## The Power of Academic Discovery

Stay organized and engaged with:
- **Tailored Topic Guides:** Generate explanations that adapt to your academic level.
- **Interactive Assessments:** Test your understanding and receive detailed, personalized feedback.
- **Key Takeaways:** Quickly absorb essential insights curated for your needs.

## A Holistic Approach to Learning

Enhance your study routine with:
- **Pomodoro Timer:** Break tasks into focused, manageable intervals.
- **Smart Reminders:** Set up to three daily reminders to keep you on track.
- **Session Tracking:** Log study/work sessions and visualize your progress with weekly graphs.
- **Session Scheduler:** Plan same-day sessions with insistent reminders and access a comprehensive session history.

---

## Features

1. **Topic Guide**  
   - Enter a topic and desired academic level to receive a clear, concise explanation.

2. **Test & Thrive**  
   - Evaluate your understanding of a topic by generating quick quizzes and practice questions.

3. **Key Takeaways**  
   - Summarize main points or insights from the content you’re studying to reinforce memory retention.

4. **Pomodoro Timer**  
   - Stay productive by breaking your work sessions into focused intervals, complete with break reminders.

5. **Daily Study Cue**  
   - Receive a daily prompt or hint that encourages continuous learning and progress.

6. **Weekly Study Pulse**  
   - Visualize your weekly study sessions via an interactive chart to gauge consistency and momentum.

7. **Study Scheduler**  
   - Plan your upcoming sessions and tasks, ensuring you never miss a deadline or important milestone.

8. **Responsive & Modern Design**  
   - Experience a seamless interface across all devices with a clean, green-themed UI.

---

## KendoReact Integration

Academic Muse utilizes various **KendoReact** components to deliver a polished and intuitive user experience. Below are the unique packages and components used, along with a brief overview of their roles within the application:

1. **@progress/kendo-react-dialogs**  
   - **Window**: Provides a floating panel or window for advanced functionalities (e.g., popup forms or informational panels).  
   - **Dialog**: Used for modal dialogues when prompting users for input or displaying important messages.  
   - **DialogActionsBar**: Supplies a styled container for dialog action buttons.

2. **@progress/kendo-react-dropdowns**  
   - **DropDownList**: Offers a dropdown menu for selecting items such as topics or categories in the user interface.  
   - **DropDownListChangeEvent**: Handles changes in the dropdown selection.

3. **@progress/kendo-react-inputs**  
   - **Input**: Basic text input field used in forms (e.g., capturing user queries, topics, or custom session names).  
   - **NumericTextBox**: Allows numeric input with optional increment/decrement buttons, ideal for setting time durations or other numeric values.  
   - **TextArea**: Enables multi-line text input for more extensive user notes or content.  
   - **InputChangeEvent**, **NumericTextBoxChangeEvent**, **TextAreaChangeEvent**: Provide typed event handlers for managing input changes consistently.

4. **@progress/kendo-react-buttons**  
   - **Button**: Provides consistent, themed buttons throughout the UI (e.g., “Generate Explanation,” “Evaluate Understanding,” “Add Study Session”).  
   - **ButtonHandle**: Used to access button instance methods and properties programmatically.

5. **@progress/kendo-react-popup**  
   - **Popup**: Renders a popup container that can be anchored to elements on the page, enhancing user interaction and layout control.

6. **@progress/kendo-react-charts**  
   - **Chart**, **ChartSeries**, **ChartSeriesItem**: Power the interactive charts that visualize weekly study sessions and user progress.  
   - **ChartCategoryAxis**, **ChartCategoryAxisItem**: Configure the x-axis of the charts for clear labeling of time or categories.

7. **@progress/kendo-react-dateinputs**  
   - **TimePicker**: Provides a convenient time-selection interface for scheduling or setting session times.

8. **@progress/kendo-react-notification**  
   - **Notification**: Displays timely alerts or confirmations (e.g., success messages, reminders) to the user in a non-intrusive manner.

All of these components work together with **@progress/kendo-theme-default** for a cohesive look and feel, ensuring that Academic Muse maintains a consistent, professional, and accessible UI.

---

## Technologies

- **React:** Powers the interactive front-end and component-based architecture.
- **SCSS/CSS:** Manages a cohesive and scalable style system.
- **Netlify:** Offers reliable hosting and streamlined continuous deployment.
- **AI/LLM Integration:** Provides automated content generation for explanations, quizzes, and summaries (e.g., for the Topic Guide and Test & Thrive features).

---

## Installation

1. **Clone the Repository:**

   ```
   git clone https://github.com/your-username/academic-muse.git
   cd academic-muse
   ```
2. Install Dependencies:

Ensure you have Node.js installed, then run:

```
npm install
```

3. Run the Development Server:

```
npm start
```
Your application will be accessible at [http://localhost:3000]().

## Deployment
Academic Muse is deployed via Netlify for quick and efficient hosting:

1. Build the Application:

```
npm run build
```

2. Install Netlify CLI (if not installed):

```
npm install -g netlify-cli
```

3. Deploy to Netlify:

```
netlify deploy --prod
```

Follow the prompts to select the build folder. Your site will then be live on Netlify.

## Automatic Deployment
If you wish to reflect local changes automatically on your Netlify site:

1. Manual Redeployment:

After making changes, run:

```
npm run build
netlify deploy --prod
```

2. Automated Watcher:

- Install `chokidar-cli` globally:

```
npm install -g chokidar-cli
```

- Add a script in your package.json:

```
"scripts": {
  "build": "react-scripts build",
  "deploy": "netlify deploy --prod",
  "watch-deploy": "chokidar 'src/**/*' -c 'npm run build && netlify deploy --prod'"
}
```

- Run:

```
npm run watch-deploy
```

This script rebuilds and redeploys automatically whenever files in src change.

## Usage
Once deployed, Academic Muse allows you to:

- Generate Topic Explanations: Quickly grasp complex topics by selecting your preferred academic level.

- Test Your Knowledge: Use the quiz feature to challenge your understanding and reinforce learning.

- Stay Organized: Track study sessions, schedule upcoming tasks, and review your weekly progress at a glance.

- Manage Focus: Use the built-in Pomodoro Timer to stay productive and maintain work-life balance.

## Contributing
Contributions are welcome to make Academic Muse even better!

1. Fork the repository.

2. Create your feature branch:

```
git checkout -b feature/YourFeature
```

3. Commit your changes:

```
git commit -m 'Add feature'
```

4. Push to your branch:

```
git push origin feature/YourFeature
```

5. Open a pull request and describe the changes you’ve made.

Thank you for helping improve Academic Muse(if you really did)!
