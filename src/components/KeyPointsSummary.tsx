import React, { useState } from 'react';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from "@progress/kendo-react-labels";
import { ProgressBar } from "@progress/kendo-react-progressbars";

interface AcademicLevel {
  id: string;
  name: string;
}

const academicLevels: AcademicLevel[] = [
  { id: 'bachelors', name: 'Bachelors' },
  { id: 'diploma', name: 'Diploma' },
  { id: 'research', name: 'Research' },
  { id: 'phd', name: 'PhD' },
  { id: 'masters', name: 'Masters' },
  { id: 'competitive', name: 'Competitive Exam' }
];

/**
 * Calls the Groq AI API to generate key points, important takeaways, acronyms, and learning hacks.
 */
const generateLearningHacks = async (topic: string, level: string): Promise<string> => {
  // Replace with your actual endpoint and secure API key.
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = process.env.REACT_APP_GROQ_AI_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Groq AI API URL or API key is not defined.");
  }

  // Construct the prompt with detailed instructions
  const prompt = `For the topic "${topic}" at a ${level} education level, provide the following:
  1. Key Points: List the most important aspects.
  2. Important Takeaways: Summarize the essential conclusions.
  3. Acronyms: Define common acronyms related to the topic.
  4. Learning Hacks: Suggest memory aids or study techniques to master this topic.
  5. Additional Resources: Recommend relevant & free courses as well as official documentation and even YouTube Tutorial links with hyperlinks in the format - Platform: Course Name (this course name is a hyperlink which links to the course).`;

  
  const payload = {
    model: "llama3-8b-8192", 
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate content from Groq AI API: ${errorText}`);
  }
  const data = await response.json();

  // Assuming the API returns the content in data.choices[0].message.content:
  return data?.choices?.[0]?.message?.content || '';
};

const formatContent = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<span style="font-size:110%; font-weight:bold;">$1</span>')
    .replace(/###/g, '');
};

const KeyPointsSummary: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>(academicLevels[0]);
  const [topicName, setTopicName] = useState<string>('');
  const [content, setContent] = useState<string>(''); // Initially empty
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  // State for simulated progress
  const [progress, setProgress] = useState<number>(0);

  const handleLevelChange = (e: DropDownListChangeEvent) => {
    setSelectedLevel(e.target.value as AcademicLevel);
  };

  const handleTopicNameChange = (e: InputChangeEvent) => {
    setTopicName(`${e.target.value ?? ''}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topicName.trim()) {
      alert('Please enter a topic name.');
      return;
    }
    setLoading(true);
    setError('');
    setProgress(0);
    // Simulate progress: increment by 5 every 300ms up to 95%
    const timer = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + 5 : prev));
    }, 300);

    try {
      const result = await generateLearningHacks(topicName, selectedLevel.name);
      clearInterval(timer);
      setProgress(100);
      setContent(result);
      localStorage.setItem('topicContent', result);
    } catch (err: unknown) {
      clearInterval(timer);
      console.error('Error generating content:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', marginBottom:'2rem' }}>
      <h2 style={{ margin: "1.5rem 18vw", fontSize: "2rem", fontWeight: "bold" }}>Key Takeaways</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Label style={{ display: 'block', marginBottom: '0.5rem' }}>Academic Level:</Label>
          <DropDownList
            data={academicLevels}
            textField="name"
            dataItemKey="id"
            value={selectedLevel}
            onChange={handleLevelChange}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Topic Name:</label>
          <Input
            value={topicName}
            onChange={handleTopicNameChange}
            placeholder="Enter topic name"
          />
        </div>
        <div>
          <Button
            type="submit"
            disabled={loading}
            style={{
              borderRadius: "4px",
              padding: "0.75rem 1.5rem",
              margin: "1rem auto", 
              display: "block",     
              fontWeight: "bold",
              fontSize: "1.2rem",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            {loading ? 'Generating...' : 'Generate Key Takeaways'}
          </Button>
        </div>
      </form>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      {/* Simulated ProgressBar with green color */}
      {loading && (
        <div style={{ marginBottom: '1rem' }}>
          <ProgressBar value={progress} style={{ backgroundColor: 'green' }} />
        </div>
      )}
     
      <div
        style={{
          position: 'relative',
          height: content ? '60vh' : '0',
          transition: 'height 0.5s ease',
          borderRadius: '12px',
          lineHeight: '1.4',
          paddingBottom: '2rem'
        }}
      >
        {content && (
          <>
            <Button
              style={{
                position: 'absolute',
                top: '0rem',
                right: '1rem',
                zIndex: 10,
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
              onClick={() => setContent('')}
            >
              Close
            </Button>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                border: '1px solid #ccc',
                marginTop: '1rem',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '5px 5px 5px green',
                height: '100%',
                overflowY: 'scroll',
                lineHeight: '1.4',
              }}
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default KeyPointsSummary;
