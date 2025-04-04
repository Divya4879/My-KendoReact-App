import React, { useState, useRef } from 'react';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from "@progress/kendo-react-labels";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Popup } from '@progress/kendo-react-popup';

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

const generateTopicExplanation = async (topic: string, level: string): Promise<string> => {
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = process.env.REACT_APP_GROQ_AI_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Groq AI API URL or API key is not defined.");
  }

  const prompt = `Explain the topic "${topic}" at a ${level} education level in about 2000 words. 
Remember that you're an internationally recognized educator with extensive experience teaching this subject.
Please generate a comprehensive, long-form explanation that starts with a detailed overview covering all the basics and core concepts of "${topic}". 
The response should be engaging, informative, and thorough so that the user gains a deep understanding and feels confident in mastering the topic.`;

  const payload = {
    model: "llama3-8b-8192", 
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.4
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
    throw new Error(`Failed to generate explanation from Groq AI API: ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
};

const formatExplanation = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<span style="font-size:150%; font-weight:bold;">$1</span>')
    .replace(/###/g, '');
};

const TopicGuide: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>(academicLevels[0]);
  const [topicName, setTopicName] = useState<string>('');
  const [explanation, setExplanation] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  const handleLevelChange = (e: DropDownListChangeEvent) => {
    setSelectedLevel(e.target.value as AcademicLevel);
  };

  const handleTopicNameChange = (e: InputChangeEvent) => {
    setTopicName(String(e.target.value ?? ''));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topicName.trim() || !selectedLevel) {
      setPopupMessage("Please provide a topic name and select an academic level.");
      setShowPopup(true);
      return;
    }
    setLoading(true);
    setProgress(0);

    // Simulate progress: increment by 10 every 200ms up to 95%
    const timer = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + 10 : prev));
    }, 200);
    
    try {
      const result = await generateTopicExplanation(topicName, selectedLevel.name);
      clearInterval(timer);
      setProgress(100);
      setExplanation(result);
      localStorage.setItem('topicExplanation', result);
    } catch (error) {
      clearInterval(timer);
      console.error('Error generating explanation:', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ margin: "1.5rem 20vw", fontSize: "2rem", fontWeight: "bold" }}>Topic Guide</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem', borderRadius: '12px' }}>
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
          <Label style={{ display: 'block', marginBottom: '0.5rem', margin: '0 auto', width: '100%' }}>
            Topic Name:
          </Label>
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
            {loading ? 'Generating...' : 'Generate Explanation'}
          </Button>
        </div>
      </form>

      {loading && (
        <div style={{ marginBottom: '1rem' }}>
          <ProgressBar value={progress} style={{ backgroundColor: 'green' }} />
        </div>
      )}

      <div
        style={{
          position: 'relative',
          height: explanation ? '60vh' : '0',
          transition: 'height 0.5s ease',
          borderRadius: '12px',
          lineHeight: '1.4',
          paddingBottom: '2rem'
        }}
      >
        {explanation && (
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
              onClick={() => setExplanation('')}
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
              }}
              dangerouslySetInnerHTML={{ __html: formatExplanation(explanation) }}
            />
          </>
        )}
      </div>

      {showPopup && (
        <Popup
          anchor={document.body}
          show={showPopup}
          popupClass="k-popup-transparent"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            padding: '1rem',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.25)'
          }}
        >
          <div>
            <p>{popupMessage}</p>
            <Button onClick={() => setShowPopup(false)}>Close</Button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default TopicGuide;
