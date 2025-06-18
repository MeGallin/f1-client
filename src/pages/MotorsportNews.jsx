/**
 * Motorsport News Page
 *
 * Displays motorsport news and related content
 */

import React from 'react';

const MotorsportNews = () => {
  return (
    <div className="motorsport-news-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Motorsport News
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-300 text-lg">
            Welcome to the motorsport news section. This page will feature the latest news, 
            updates, and insights from the world of Formula 1 and motorsport.
          </p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Coming Soon</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Latest F1 race results and standings</li>
              <li>• Driver and team news</li>
              <li>• Technical updates and regulations</li>
              <li>• Race weekend previews and reviews</li>
              <li>• Championship analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorsportNews;
