import React from 'react';

const About = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className=" text-white text-2xl font-bold mb-4">About Activity Tracker</h2>
      <p className="text-[#DADDE2] mb-4">
        The Activity Tracker is a Chrome extension designed to help users monitor and analyze their internet usage habits. In today's digital age, it's easy to lose track of time while browsing the web, often leading to decreased productivity. This extension aims to address this issue by providing users with insights into their online activities.
      </p>
      <h3 className="text-lg font-bold mb-2 text-white">Key Features:</h3>
      <ul className="list-disc pl-6 mb-4 text-[#DADDE2]">
        <li>Tracks time spent on each website and specific parts of websites</li>
        <li>Allows users to restrict access to distracting websites</li>
        <li>Offers a personalized dashboard for users to visualize their website usage</li>
      </ul>
      <h3 className="text-lg font-bold mb-2 text-white">Technology Stack:</h3>
      <ul className="list-disc pl-6 mb-4 text-[#DADDE2]">
        <li>Backend: Ruby on Rails</li>
        <li>Frontend: Any JavaScript Framework</li>
        <li>Database: MySQL</li>
        <li>Deployment: GitHub and cloud-hosting platform</li>
      </ul>
      <h3 className="text-lg font-bold mb-2 text-white">Value to Society:</h3>
      <p className="text-[#DADDE2] mb-4 ">
        The Activity Tracker empowers users to take control of their online habits, fostering a more mindful and productive approach to internet usage. By providing insights and tools to manage time spent on distracting websites, the extension promotes healthier digital behaviors, ultimately contributing to improved focus, efficiency, and well-being in the digital age.
      </p>
    </div>
  );
};

export default About;
