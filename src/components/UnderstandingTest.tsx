import React, { useState } from 'react';
import { TextArea, TextAreaChangeEvent } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { evaluateUnderstanding } from '../services/genAiService';

const UnderstandingTest: React.FC = () => {
  const [explanationInput, setExplanationInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>(''); // Holds the API response
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: TextAreaChangeEvent) => {
    setExplanationInput(e.target.value ?? '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!explanationInput.trim()) {
      alert('Please provide your explanation.');
      return;
    }
    setLoading(true);
    try {
      const result = await evaluateUnderstanding(explanationInput);
      setFeedback(result);
      localStorage.setItem('understandingFeedback', result);
    } catch (error) {
      console.error('Error evaluating understanding:', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  // Formats the feedback by converting **text** to a styled span.
  const formatFeedback = (text: string): string => {
    return text.replace(/\*\*(.*?)\*\*/g, '<span style="font-size:150%; font-weight:bold;">$1</span>');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ margin: "1.5rem 20vw", fontSize: "2rem", fontWeight: "bold" }}>Test & Thrive</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Explain the topic (up to 3000 words) and get personalized feedback:
          </label>
          <TextArea
            value={explanationInput}
            onChange={handleInputChange}
            placeholder="Type your explanation here..."
            rows={10}
            style={{
              width: '100%',
              display: "inline-block",
              minHeight: '5rem',
              padding: '0.75rem',
              fontSize: '1rem',
              lineHeight: '1.4',
              borderRadius: '4px',
              border: '1px solid #a5d6a7',
              backgroundColor: '#f1f8e9',
              color: '#1b5e20',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              fontFamily: "'Roboto', sans-serif",
            }}
            maxLength={20000}
          />
        </div>
        <div>
          <Button 
            type="submit" 
            disabled={loading}
            style={{
              borderRadius: "4px",
              padding: "0.75rem 1.5rem",
              margin: "1rem auto",  // Centers the button horizontally
              display: "block",      // Required for margin auto centering
              fontWeight: "bold",
              fontSize: "1.2rem",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            {loading ? 'Evaluating...' : 'Evaluate Understanding'}
          </Button>
        </div>
      </form>
      {/* Feedback Container with Close Button */}
      <div
        style={{
          position: 'relative',
          
          height: feedback ? '60vh' : '0',
          transition: 'height 0.5s ease',
          
          borderRadius: '12px',
          lineHeight: '1.4',
          paddingBottom: '2rem'
        }}
      >
        {feedback && (
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
              onClick={() => setFeedback('')}
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
              dangerouslySetInnerHTML={{ __html: formatFeedback(feedback) }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UnderstandingTest;
