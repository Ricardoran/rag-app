'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResponse('');
    setSources([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setResponse(data.response);
      setSources(data.sources || []);
    } catch (error) {
      console.error('Search error:', error);
      setResponse('Sorry, I encountered an error while processing your request. Please try again.');
      setSources([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>RAG Search</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Search Form */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className={styles.searchInput}
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className={styles.searchButton}
            >
              {isSearching ? (
                <div className={styles.searchingIndicator}>
                  <div className={styles.spinner}></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* Response Display */}
        {response && (
          <div className={styles.responseContainer}>
            <div className={styles.responseCard}>
              <h2 className={styles.responseTitle}>Response</h2>
              <div className={styles.responseContent}>
                <p className={styles.responseText}>
                  {response}
                </p>
              </div>
            </div>

            {/* Sources */}
            {sources.length > 0 && (
              <div className={styles.sourcesCard}>
                <h3 className={styles.sourcesTitle}>Sources</h3>
                <div className={styles.sourcesContainer}>
                  {sources.map((source, index) => (
                    <span
                      key={index}
                      className={styles.sourceTag}
                    >
                      {index + 1}. {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!response && !isSearching && (
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeIcon}>🔍</div>
            <h2 className={styles.welcomeTitle}>
              Ask me anything
            </h2>
            <p className={styles.welcomeDescription}>
              I'll search through your knowledge base and provide accurate answers with source citations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
