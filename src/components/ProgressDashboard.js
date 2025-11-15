import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline';

function ProgressDashboard({ progress, onExploreClick }) {
  const { uniqueCountries, totalCountries, progressPercentage } = progress;

  return (
    <div className="bg-dark-secondary border border-dark-border rounded-xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl mb-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <TrophyIcon className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Journey Progress</h3>
        <p className="text-text-secondary text-sm">Your cultural exploration journey</p>
      </div>

      {/* Progress Stats */}
      <div className="space-y-4 mb-6">
        {/* Countries Explored */}
        <div className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-secondary/20 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="w-4 h-4 text-accent-secondary" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Countries Explored</div>
              <div className="text-lg font-bold text-text-primary">
                {uniqueCountries} / {totalCountries}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-tertiary/20 rounded-lg flex items-center justify-center">
              <span className="text-accent-tertiary font-bold text-sm">%</span>
            </div>
            <div>
              <div className="text-sm text-text-secondary">World Coverage</div>
              <div className="text-lg font-bold text-text-primary">{progressPercentage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-dark-tertiary rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-accent-primary to-accent-secondary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Explore Button */}
      <motion.button
        onClick={onExploreClick}
        className="w-full btn btn-accent-primary group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SparklesIcon className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
        Explore
      </motion.button>

      {/* Motivational Message */}
      <div className="text-center mt-4">
        <p className="text-text-secondary text-sm">
          🌍 Keep exploring to discover more cultures!
        </p>
      </div>
    </div>
  );
}

export default ProgressDashboard;
