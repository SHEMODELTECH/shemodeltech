import React from 'react';

const MarketTrendsSection = ({ marketTrends, careerPaths }) => {
  // If no market trends data is available, show a clear message
  if (!marketTrends || marketTrends.length === 0) {
    return (
      <div className="bg-blue-50 p-3 sm:p-4 md:p-5 rounded-lg">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-700 text-sm sm:text-base">
            Market trends data is not available for this analysis. Please retake the assessment
            to get the latest market insights or consult industry resources for current trends.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to get appropriate color based on growth status
  const getGrowthColor = (text) => {
    if (!text) return 'text-gray-600';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('high') || lowerText.includes('strong') || lowerText.includes('growing') || lowerText.includes('increase')) {
      return 'text-blue-600';
    } else if (lowerText.includes('moderate') || lowerText.includes('stable')) {
      return 'text-blue-600';
    } else if (lowerText.includes('low') || lowerText.includes('declin') || lowerText.includes('decrease')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  // Helper function to format salary ranges with appropriate styling
  const formatSalaryRange = (salaryText) => {
    if (!salaryText) return null;
    
    // Try to extract salary ranges using regex
    const ranges = salaryText.match(/\$[\d,]+-\$[\d,]+/g) || [];
    if (ranges.length === 0) return <span className="text-xs sm:text-sm md:text-base">{salaryText}</span>;
    
    return (
      <div className="grid grid-cols-1 gap-1 sm:gap-2">
        {ranges.map((range, idx) => (
          <div key={idx} className="flex items-center">
            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base">{range}</span>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to extract technology names from text
  const extractTechnologies = (text) => {
    if (!text) return [];
    
    // Look for lists in the text
    const techLists = text.match(/such as ([^.]+)/i) || 
                     text.match(/including ([^.]+)/i) ||
                     text.match(/notably ([^.]+)/i);
    
    if (techLists && techLists[1]) {
      return techLists[1].split(',')
        .map(tech => tech.replace(/and/i, '').trim())
        .filter(tech => tech.length > 0);
    }
    
    // If no list found, try to extract technologies by common tech words
    const techKeywords = [
      'AI', 'Machine Learning', 'Python', 'JavaScript', 'React', 'Cloud', 'DevOps',
      'Data Science', 'Cybersecurity', 'Blockchain', 'AR/VR', 'IoT', 'Docker',
      'Kubernetes', 'AWS', 'Azure', 'GCP', 'GraphQL', 'Node.js', 'TypeScript'
    ];
    
    const foundTechs = [];
    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        foundTechs.push(keyword);
      }
    });
    
    return foundTechs.length > 0 ? foundTechs : [];
  };
  
  // Extract salary information from the trends
  const findSalaryTrend = () => {
    return marketTrends.find(trend => 
      trend.aspect === 'SALARY TRENDS' || trend.aspect === 'Salary Trends'
    );
  };
  
  // Extract job market information
  const findJobMarketTrend = () => {
    return marketTrends.find(trend => 
      trend.aspect === 'JOB MARKET OUTLOOK' || trend.aspect === 'Job Market Outlook'
    );
  };
  
  // Extract emerging technologies
  const findTechTrend = () => {
    return marketTrends.find(trend => 
      trend.aspect === 'EMERGING TECHNOLOGIES' || trend.aspect === 'Emerging Technologies'
    );
  };
  
  // Extract industry sectors
  const findIndustryTrend = () => {
    return marketTrends.find(trend => 
      trend.aspect === 'INDUSTRY SECTOR ANALYSIS' || trend.aspect === 'Industry Sector Analysis'
    );
  };
  
  // Get relevant trends
  const salaryTrend = findSalaryTrend();
  const jobMarketTrend = findJobMarketTrend();
  const techTrend = findTechTrend();
  const industryTrend = findIndustryTrend();
  
  // Extract technologies if not already processed
  const technologies = techTrend?.technologies || extractTechnologies(techTrend?.details || '');
  
  // Extract industries if not already processed
  const extractIndustries = (text) => {
    if (!text) return [];
    
    const industryLists = text.match(/sectors include ([^.]+)/i) || 
                         text.match(/industries like ([^.]+)/i) ||
                         text.match(/notably in ([^.]+)/i);
    
    if (industryLists && industryLists[1]) {
      return industryLists[1].split(',')
        .map(ind => ind.replace(/and/i, '').trim())
        .filter(ind => ind.length > 0);
    }
    
    const commonIndustries = [
      'Healthcare', 'Finance', 'Insurance', 'Technology', 'Retail',
      'Manufacturing', 'Education', 'Government', 'Consulting', 'Energy'
    ];
    
    const foundIndustries = [];
    commonIndustries.forEach(ind => {
      if (text.includes(ind)) {
        foundIndustries.push(ind);
      }
    });
    
    return foundIndustries.length > 0 ? foundIndustries : [];
  };
  
  const industries = industryTrend?.topIndustries || extractIndustries(industryTrend?.details || '');

  // Display a note at the top if some sections are missing
  const missingTrends = [];
  if (!jobMarketTrend) missingTrends.push('Job Market Outlook');
  if (!salaryTrend) missingTrends.push('Salary Trends');
  if (!techTrend) missingTrends.push('Emerging Technologies');
  if (!industryTrend) missingTrends.push('Industry Sector Analysis');

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Warning note if some sections are missing */}
      {missingTrends.length > 0 && (
        <div className="bg-orange-50 p-3 sm:p-4 md:p-5 rounded-lg mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="min-w-0">
              <p className="text-orange-800 font-medium text-sm sm:text-base">Some market trend data may be incomplete</p>
              <p className="text-orange-700 text-xs sm:text-sm mt-1 break-words">
                The following sections are not available: {missingTrends.join(', ')}. 
                This analysis uses only the available data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Job Market Outlook */}
      {jobMarketTrend && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Job Market Outlook</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <p className="text-gray-700 text-sm sm:text-base break-words">{jobMarketTrend.details}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {careerPaths.slice(0, 4).map((path, index) => (
              <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-base sm:text-lg mb-2 break-words">{path.title}</h4>
                <div className="flex items-center mb-2 flex-wrap">
                  <span className="mr-2 text-xs sm:text-sm md:text-base">Demand:</span>
                  <span className={`font-semibold text-xs sm:text-sm md:text-base ${getGrowthColor(
                    jobMarketTrend.details.includes(path.title) ? 
                      jobMarketTrend.details.substring(
                        jobMarketTrend.details.indexOf(path.title),
                        jobMarketTrend.details.indexOf('.', jobMarketTrend.details.indexOf(path.title))
                      ) : ''
                  )}`}>
                    {path.match}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Trends */}
      {salaryTrend && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Salary Trends</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <p className="text-gray-700 text-sm sm:text-base break-words">{salaryTrend.details}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-base sm:text-lg mb-2">Entry Level</h4>
              <div className="text-blue-700 font-semibold">
                {formatSalaryRange(salaryTrend.entryLevel || salaryTrend.details)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-base sm:text-lg mb-2">Mid Level</h4>
              <div className="text-blue-700 font-semibold">
                {formatSalaryRange(salaryTrend.midLevel || salaryTrend.details)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-base sm:text-lg mb-2">Senior Level</h4>
              <div className="text-blue-700 font-semibold">
                {formatSalaryRange(salaryTrend.seniorLevel || salaryTrend.details)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regional Opportunities */}
      {marketTrends.find(trend => trend.aspect === 'REGIONAL OPPORTUNITIES' || trend.aspect === 'Regional Opportunities') && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Regional Opportunities</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <p className="text-gray-700 text-sm sm:text-base break-words">
              {marketTrends.find(trend => 
                trend.aspect === 'REGIONAL OPPORTUNITIES' || trend.aspect === 'Regional Opportunities'
              )?.details}
            </p>
          </div>
        </div>
      )}

      {/* Emerging Technologies */}
      {techTrend && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Emerging Technologies</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <p className="text-gray-700 text-sm sm:text-base break-words">{techTrend.details}</p>
          </div>
          
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              {technologies.map((tech, techIndex) => (
                <span key={techIndex} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm break-all">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Industry Sector Analysis */}
      {industryTrend && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Top Hiring Industries</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <p className="text-gray-700 text-sm sm:text-base break-words">{industryTrend.details}</p>
          </div>
          
          {industries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              {industries.map((industry, indIndex) => (
                <span key={indIndex} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm break-all">
                  {industry}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Source Note */}
      <div className="text-xs sm:text-sm text-gray-500 italic mt-3 sm:mt-4 px-2">
        Note: Market trend data is based on the latest available information as of 2025. Industry trends may change rapidly.
      </div>
    </div>
  );
};

export default MarketTrendsSection;
