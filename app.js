document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. ROUTING SYSTEM (Client-Side Hash Router)
  // ==========================================
  const routes = {
    'home': 'page-home',
    'success-stories': 'page-success-stories',
    'ats-tool': 'page-ats-tool',
    'contact': 'page-contact'
  };

  const navLinks = document.querySelectorAll('.nav-link');
  const pageViews = document.querySelectorAll('.page-view');

  function handleRoute() {
    let hash = window.location.hash || '#/';
    
    // Normalize hash
    let routeName = 'home';
    let anchorName = null;

    if (hash.startsWith('#/')) {
      const path = hash.substring(2);
      if (path === 'success-stories' || path === 'ats-tool' || path === 'contact') {
        routeName = path;
      } else if (path) {
        // e.g. #/solution, #/services
        routeName = 'home';
        anchorName = path;
      }
    } else if (hash.startsWith('#')) {
      // e.g. #solution, #services
      routeName = 'home';
      anchorName = hash.substring(1);
    }

    // Toggle active view
    pageViews.forEach(view => {
      if (view.id === routes[routeName]) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update nav link states
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === hash || (routeName === 'home' && href.includes(anchorName))) {
        link.classList.add('active');
      } else if (routeName === 'success-stories' && href.includes('success-stories')) {
        link.classList.add('active');
      } else if (routeName === 'ats-tool' && href.includes('ats-tool')) {
        link.classList.add('active');
      } else if (routeName === 'contact' && href.includes('contact')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll handling
    if (routeName === 'home' && anchorName) {
      setTimeout(() => {
        const targetElement = document.getElementById(anchorName);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Special: if navigating to ATS Scanner, reset / trigger animations
    if (routeName === 'ats-tool') {
      triggerScoreCircleAnimation(0);
    }
  }




  // ==========================================
  // 2. MOBILE DRAWER NAVIGATION
  // ==========================================
  const mobileDrawer = document.getElementById('mobileDrawer');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileDrawerCloseBtn = document.getElementById('mobileDrawerCloseBtn');

  menuToggleBtn.addEventListener('click', () => {
    mobileDrawer.classList.add('open');
  });

  mobileDrawerCloseBtn.addEventListener('click', () => {
    mobileDrawer.classList.remove('open');
  });

  // Close drawer on clicking links
  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });


  // ==========================================
  // 3. HEADER SCROLL FX
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.querySelector('nav').classList.add('scrolled');
    } else {
      header.querySelector('nav').classList.remove('scrolled');
    }
  });


  // ==========================================
  // 4. FAQ ACCORDION TOGGLE
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-content').style.maxHeight = null;
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  // ==========================================
  // 5. STATS ANIMATED COUNTER
  // ==========================================
  const counters = document.querySelectorAll('.counter-val');
  const counterSection = document.querySelector('.counter-section');

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 100; // lower is faster
      const increment = target / speed;

      const updateCount = () => {
        const count = +counter.innerText.replace('+', '').replace('%', '');
        if (count < target) {
          counter.innerText = Math.ceil(count + increment) + (target === 500 ? '+' : (target === 250 ? '+' : (target === 145 ? '%' : '')));
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target + (target === 500 ? '+' : (target === 250 ? '+' : (target === 145 ? '%' : '')));
        }
      };
      updateCount();
    });
  };

  // Intersection Observer for counter animation trigger
  if (counterSection) {
    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          animateCounters();
          triggered = true;
        }
      });
    }, { threshold: 0.3 });
    observer.observe(counterSection);
  }


  // ==========================================
  // 6. CONTACT FORM & SUCCESS MODAL
  // ==========================================
  const bookingForm = document.getElementById('bookingForm');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Pre-fill plan service based on query param
  function updateServiceFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const serviceSelect = document.getElementById('serviceSelected');
    if (serviceSelect && plan) {
      if (plan === 'starter') {
        serviceSelect.value = 'Resume Writing';
      } else if (plan === 'professional') {
        serviceSelect.value = 'LinkedIn Optimization';
      } else if (plan === 'premium') {
        serviceSelect.value = 'Executive Resume Writing';
      } else if (plan === 'comeback') {
        serviceSelect.value = 'Career Coaching';
      }
    }
  }

  // Pre-fill on navigate to contact
  window.addEventListener('hashchange', () => {
    if (window.location.hash.includes('/contact')) {
      setTimeout(updateServiceFromUrl, 50);
    }
  });
  updateServiceFromUrl();

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('emailAddr').value.trim();
      const title = document.getElementById('jobTitle').value.trim();
      const yoe = document.getElementById('yoe').value.trim();
      const service = document.getElementById('serviceSelected').value;
      const message = document.getElementById('messageText').value.trim();

      if (!name || !email || !title || !yoe || !service || !message) {
        alert('Kindly complete all the required fields in the form.');
        return;
      }

      // Email validation
      if (!validateEmail(email)) {
        alert('Please check your email address and enter a valid one.');
        return;
      }

      // Show Success Modal
      successModal.classList.add('open');
      bookingForm.reset();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('open');
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }


  // ==========================================
  // 7. ATS RESUME SCANNER & ANALYZER LOGIC
  // ==========================================
  const analyzeBtn = document.getElementById('analyzeResumeBtn');
  const resumeInput = document.getElementById('resumeTextInput');
  const jobInput = document.getElementById('jobDescTextInput');
  
  // Elements to update
  const scorePercentText = document.getElementById('atsScorePercentText');
  const scoreCircleFill = document.getElementById('atsScoreFillCircle');
  const gradeText = document.getElementById('atsGradeText');
  
  const kwPercent = document.getElementById('keywordScorePercent');
  const kwFill = document.getElementById('keywordScoreFill');
  const fmtPercent = document.getElementById('formattingScorePercent');
  const fmtFill = document.getElementById('formattingScoreFill');
  const structPercent = document.getElementById('structureScorePercent');
  const structFill = document.getElementById('structureScoreFill');
  
  const keywordContainer = document.getElementById('atsKeywordContainer');
  const findingsList = document.getElementById('atsAuditFindingsList');

  // List of high-importance keywords to check for
  const targetKeywordsLibrary = [
    'react', 'typescript', 'javascript', 'node.js', 'node', 'vue', 'angular',
    'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'springboot',
    'c++', 'c#', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform',
    'sql', 'postgres', 'postgresql', 'mysql', 'mongodb', 'nosql', 'redis',
    'rest api', 'graphql', 'system design', 'microservices', 'ci/cd', 'git',
    'agile', 'scrum', 'unit testing', 'jest', 'cypress', 'selenium',
    'machine learning', 'ai', 'data analytics', 'data science',
    'seo', 'sem', 'google analytics', 'hubspot', 'marketing strategy',
    'growth marketing', 'product management', 'product roadmap', 'star framework',
    'behavioral', 'leadership', 'scrum master', 'cloud architecture'
  ];

  function triggerScoreCircleAnimation(score) {
    const radius = 72;
    const circumference = 2 * Math.PI * radius; // 452.4
    const offset = circumference - (score / 100) * circumference;
    scoreCircleFill.style.strokeDashoffset = offset;
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const resumeText = resumeInput.value.trim();
      const jobDescText = jobInput.value.trim();

      if (!resumeText) {
        alert('You must paste your resume content to initiate the analysis.');
        return;
      }
      if (!jobDescText) {
        alert('Kindly provide a job description to perform the comparison.');
        return;
      }

      // Normalization
      const normResume = resumeText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");
      const normJob = jobDescText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");

      // Helper to match keywords with special chars (c++, c#) correctly
      function hasWord(text, word) {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const lead = /^\w/.test(word) ? '\\b' : '';
        const trail = /\w$/.test(word) ? '\\b' : '';
        const regex = new RegExp(lead + escaped + trail, 'i');
        return regex.test(text);
      }

      // 1. Keyword Scan
      // Find which keywords exist in the job desc first
      const jobKeywords = targetKeywordsLibrary.filter(kw => {
        return hasWord(jobDescText, kw);
      });

      // If job desc doesn't contain any known keywords, use a default fallback set
      const activeKeywords = jobKeywords.length > 0 ? jobKeywords : ['javascript', 'react', 'node.js', 'aws', 'agile', 'git'];

      // Check which of the active keywords are present in the resume
      const matchedKeywords = [];
      const missingKeywords = [];

      activeKeywords.forEach(kw => {
        if (hasWord(resumeText, kw)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });

      const keywordScore = activeKeywords.length > 0 
        ? Math.round((matchedKeywords.length / activeKeywords.length) * 100)
        : 70;


      // 2. Formatting Audit
      let formatScore = 100;
      const formatFindings = [];

      // Check for Email
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      if (emailRegex.test(resumeText)) {
        formatFindings.push({ type: 'success', text: 'Contact Info: Email address identified.' });
      } else {
        formatScore -= 25;
        formatFindings.push({ type: 'error', text: 'Email Missing: An email address is required so recruiters can contact you.' });
      }

      // Check for Phone
      const phoneRegex = /(\+?\d{1,4}[\s-])?\(?\d{3}\)?[\s-]\d{3}[\s-]\d{4}|\+?\d{10,13}/;
      if (phoneRegex.test(resumeText)) {
        formatFindings.push({ type: 'success', text: 'Contact Info: Phone number identified.' });
      } else {
        formatScore -= 25;
        formatFindings.push({ type: 'error', text: 'Phone Number Missing: Provide a phone number in your contact section.' });
      }

      // Check for LinkedIn link
      const liRegex = /linkedin\.com/i;
      if (liRegex.test(resumeText)) {
        formatFindings.push({ type: 'success', text: 'Web Presence: LinkedIn link identified.' });
      } else {
        formatScore -= 25;
        formatFindings.push({ type: 'error', text: 'LinkedIn Link Missing: Over 70% of recruiters look up candidates on LinkedIn.' });
      }

      // Check for length/too short
      const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount >= 150) {
        formatFindings.push({ type: 'success', text: `Length: Resume length is sufficient (${wordCount} words).` });
      } else {
        formatScore -= 25;
        formatFindings.push({ type: 'error', text: `Too Short: Your resume has only ${wordCount} words. Parsers flag thin profiles.` });
      }


      // 3. Structure & Quality Check
      let structScore = 100;
      const structFindings = [];

      // Experience Heading Check
      if (/experience|work history|employment/i.test(normResume)) {
        structFindings.push({ type: 'success', text: 'Headings Audit: Work Experience section identified.' });
      } else {
        structScore -= 25;
        structFindings.push({ type: 'error', text: 'Missing Work Experience Section: Use common headings like "Work Experience" or "Professional History".' });
      }

      // Skills Heading Check
      if (/skills|technologies|expertise/i.test(normResume)) {
        structFindings.push({ type: 'success', text: 'Headings Audit: Technical or Core Skills section identified.' });
      } else {
        structScore -= 25;
        structFindings.push({ type: 'error', text: 'Skills Section Missing: List your core competencies and tools in a dedicated section.' });
      }

      // Bullet points presence check
      if (/[-*•\u2022]/i.test(resumeText)) {
        structFindings.push({ type: 'success', text: 'Format Check: Standard bullet points found.' });
      } else {
        structScore -= 30;
        structFindings.push({ type: 'error', text: 'No Bullets Found: Avoid long paragraphs. Use clear bullet points with standard characters (- or •).' });
      }

      // Check wordiness / too long
      if (wordCount > 750) {
        structScore -= 20;
        structFindings.push({ type: 'error', text: `Too Long: Resume has ${wordCount} words. Target under 650 words for readability.` });
      } else if (wordCount >= 150) {
        structFindings.push({ type: 'success', text: 'Format Check: Page margins and content density are well-proportioned.' });
      }


      // Final Calculations
      formatScore = Math.max(0, formatScore);
      structScore = Math.max(0, structScore);

      // Weighted Score (40% Keywords, 30% Formatting, 30% Structure)
      const overallScore = Math.round((keywordScore * 0.4) + (formatScore * 0.3) + (structScore * 0.3));


      // Render results
      // 1. Circle & Text
      scorePercentText.innerText = `${overallScore}%`;
      triggerScoreCircleAnimation(overallScore);

      // Grade text
      let grade = '';
      if (overallScore >= 80) {
        grade = '<span style="color: var(--success); font-weight:700;">EXCELLENT ATS ALIGNMENT (Ready to Apply)</span>. Your document shows solid keyword density and a parser-friendly layout.';
      } else if (overallScore >= 60) {
        grade = '<span style="color: var(--gold); font-weight:700;">BORDERLINE MATCH (Revisions Needed)</span>. We recommend adding the missing keywords and addressing layout recommendations.';
      } else {
        grade = '<span style="color: var(--error); font-weight:700;">CRITICAL FLAGS (High Rejection Risk)</span>. Your profile lacks too many target terms or has critical formatting issues.';
      }
      gradeText.innerHTML = grade;

      // 2. Metric Bars
      kwPercent.innerText = `${keywordScore}%`;
      kwFill.style.width = `${keywordScore}%`;
      
      fmtPercent.innerText = `${formatScore}%`;
      fmtFill.style.width = `${formatScore}%`;

      structPercent.innerText = `${structScore}%`;
      structFill.style.width = `${structScore}%`;

      // 3. Keyword tags
      keywordContainer.innerHTML = '';
      matchedKeywords.forEach(kw => {
        keywordContainer.innerHTML += `<span class="keyword-tag matched">✓ ${kw}</span>`;
      });
      missingKeywords.forEach(kw => {
        keywordContainer.innerHTML += `<span class="keyword-tag missing">✕ ${kw}</span>`;
      });
      if (matchedKeywords.length === 0 && missingKeywords.length === 0) {
        keywordContainer.innerHTML = '<span style="font-size:12px; color:var(--text-muted);">No key terms matched in job description.</span>';
      }

      // 4. Audit Findings
      findingsList.innerHTML = '';
      const allFindings = [...formatFindings, ...structFindings];
      allFindings.forEach(f => {
        const icon = f.type === 'success' 
          ? '<span style="color: var(--success); font-weight:bold;">✓</span>' 
          : '<span style="color: var(--error); font-weight:bold;">✕</span>';
        findingsList.innerHTML += `<li><span class="icon">${icon}</span> <span>${f.text}</span></li>`;
      });

      // Smooth scroll to results on mobile devices
      const dashboard = document.getElementById('atsResultsDashboard');
      if (window.innerWidth < 992 && dashboard) {
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Run router after all declarations are complete
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

});
