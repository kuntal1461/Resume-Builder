INSERT INTO resume_template_parent_category_master (name, slug, parent_id, sort_order)
VALUES
('Computer Science & Engineering', 'cse', NULL, 1),
('Data Science & Analytics', 'data-science', NULL, 2),
('Artificial Intelligence & Machine Learning', 'ai-ml', NULL, 3),
('Software Engineering', 'software-engineering', NULL, 4),
('Cloud & DevOps', 'cloud-devops', NULL, 5),
('Cybersecurity', 'cybersecurity', NULL, 6),
('Mobile App Development', 'mobile-development', NULL, 7),
('Web Development', 'web-development', NULL, 8),
('Full Stack Engineering', 'full-stack-engineering', NULL, 9),
('UI/UX & Product Design', 'ui-ux', NULL, 10),
('Quality Assurance & Testing', 'qa-testing', NULL, 11),
('IT Infrastructure & Networking', 'infra-networking', NULL, 12);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Backend Engineering', 'backend-engineering', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 1),
('Frontend Engineering', 'frontend-engineering', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 2),
('Full Stack Development', 'full-stack-development', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 3),
('Systems Engineering', 'systems-engineering', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 4),
('Database Engineering', 'database-engineering', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 5),
('Distributed Systems', 'distributed-systems', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 6),
('API Engineering', 'api-engineering', (SELECT id FROM resume_template_parent_category_master WHERE slug='cse'), 7);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Data Scientist', 'data-scientist', (SELECT id FROM resume_template_parent_category_master WHERE slug='data-science'), 1),
('Data Analyst', 'data-analyst', (SELECT id FROM resume_template_parent_category_master WHERE slug='data-science'), 2),
('Business Analyst', 'business-analyst', (SELECT id FROM resume_template_parent_category_master WHERE slug='data-science'), 3),
('Data Engineer', 'data-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='data-science'), 4),
('BI Developer', 'bi-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='data-science'), 5),
('Statistician', 'statistician', (SELECT id FROM resume_template_parent_category_master WHERE slug='data-science'), 6);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Machine Learning Engineer', 'ml-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ai-ml'), 1),
('AI Engineer', 'ai-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ai-ml'), 2),
('Deep Learning Engineer', 'deep-learning-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ai-ml'), 3),
('NLP Engineer', 'nlp-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ai-ml'), 4),
('Computer Vision Engineer', 'cv-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ai-ml'), 5),
('AI Research Scientist', 'ai-research-scientist', (SELECT id FROM resume_template_parent_category_master WHERE slug='ai-ml'), 6);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Java Developer', 'java-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='software-engineering'), 1),
('Python Developer', 'python-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='software-engineering'), 2),
('C++ Developer', 'cpp-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='software-engineering'), 3),
('Golang Developer', 'golang-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='software-engineering'), 4),
('.NET Developer', 'dotnet-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='software-engineering'), 5),
('Systems Programmer', 'systems-programmer', (SELECT id FROM resume_template_parent_category_master WHERE slug='software-engineering'), 6);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('DevOps Engineer', 'devops-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='cloud-devops'), 1),
('Cloud Engineer', 'cloud-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='cloud-devops'), 2),
('SRE Engineer', 'sre-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='cloud-devops'), 3),
('Kubernetes Specialist', 'kubernetes-specialist', (SELECT id FROM resume_template_parent_category_master WHERE slug='cloud-devops'), 4),
('Platform Engineer', 'platform-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='cloud-devops'), 5);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Security Analyst', 'security-analyst', (SELECT id FROM resume_template_parent_category_master WHERE slug='cybersecurity'), 1),
('Application Security Engineer', 'appsec-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='cybersecurity'), 2),
('SOC Analyst', 'soc-analyst', (SELECT id FROM resume_template_parent_category_master WHERE slug='cybersecurity'), 3),
('Ethical Hacker / Pen Tester', 'pentester', (SELECT id FROM resume_template_parent_category_master WHERE slug='cybersecurity'), 4),
('Cloud Security Engineer', 'cloud-security-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='cybersecurity'), 5);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Android Developer', 'android-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='mobile-development'), 1),
('iOS Developer', 'ios-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='mobile-development'), 2),
('Flutter Developer', 'flutter-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='mobile-development'), 3),
('React Native Developer', 'react-native-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='mobile-development'), 4);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Frontend Developer', 'frontend-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='web-development'), 1),
('JavaScript Developer', 'javascript-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='web-development'), 2),
('React Developer', 'react-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='web-development'), 3),
('Angular Developer', 'angular-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='web-development'), 4),
('Vue Developer', 'vue-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='web-development'), 5);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('MERN Stack Developer', 'mern-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='full-stack-engineering'), 1),
('MEAN Stack Developer', 'mean-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='full-stack-engineering'), 2),
('Java Full Stack Developer', 'java-fullstack-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='full-stack-engineering'), 3),
('Python Full Stack Developer', 'python-fullstack-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='full-stack-engineering'), 4),
('Node.js Full Stack Developer', 'nodejs-fullstack-developer', (SELECT id FROM resume_template_parent_category_master WHERE slug='full-stack-engineering'), 5);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('UI Designer', 'ui-designer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ui-ux'), 1),
('UX Designer', 'ux-designer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ui-ux'), 2),
('Product Designer', 'product-designer', (SELECT id FROM resume_template_parent_category_master WHERE slug='ui-ux'), 3),
('UX Researcher', 'ux-researcher', (SELECT id FROM resume_template_parent_category_master WHERE slug='ui-ux'), 4);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('QA Engineer', 'qa-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='qa-testing'), 1),
('Automation Test Engineer', 'automation-test-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='qa-testing'), 2),
('Manual Test Engineer', 'manual-test-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='qa-testing'), 3),
('Performance Test Engineer', 'performance-test-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='qa-testing'), 4);

INSERT INTO resume_template_sub_category_master (name, slug, parent_id, sort_order)
VALUES
('Network Administrator', 'network-admin', (SELECT id FROM resume_template_parent_category_master WHERE slug='infra-networking'), 1),
('System Administrator', 'system-admin', (SELECT id FROM resume_template_parent_category_master WHERE slug='infra-networking'), 2),
('Infrastructure Engineer', 'infrastructure-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='infra-networking'), 3),
('Network Security Engineer', 'network-security-engineer', (SELECT id FROM resume_template_parent_category_master WHERE slug='infra-networking'), 4);
