import { PromptTemplate, PromptTemplateId } from '../types';

export const PROMPT_TEMPLATES: Record<PromptTemplateId, PromptTemplate> = {
  general_ats: {
    id: 'general_ats',
    name: 'General ATS Optimization',
    description: 'Universal prompt balanced for maximum ATS parser parsing and general recruiter readability.',
    roleContext: 'You are an elite executive resume writer and ATS optimization specialist.',
    specialInstructions: [
      'Optimize keyword density seamlessly without keyword stuffing.',
      'Ensure standard, universally recognized section headers.'
    ]
  },
  senior_software_engineer: {
    id: 'senior_software_engineer',
    name: 'Senior Software Engineer',
    description: 'Focuses on architectural decisions, system design, leadership, and high-scale impact.',
    roleContext: 'You are a Principal Engineer and Tech Recruiter evaluating Senior Software Engineers.',
    specialInstructions: [
      'Emphasize architectural trade-offs, system scalability, distributed systems, and cross-team tech leadership.',
      'Highlight mentorship, code review standards, and CI/CD quality engineering.'
    ]
  },
  frontend_developer: {
    id: 'frontend_developer',
    name: 'Frontend Developer',
    description: 'Highlights UI/UX precision, state management, web performance, and modern JavaScript frameworks.',
    roleContext: 'You are a Staff Frontend Architect focusing on Web Performance, UI Engineering, and Design Systems.',
    specialInstructions: [
      'Highlight Core Web Vitals optimizations (LCP, FID/INP, CLS), modern component state management, and modern CSS.',
      'Emphasize accessibility (a11y), cross-browser compatibility, and modular design systems.'
    ]
  },
  backend_developer: {
    id: 'backend_developer',
    name: 'Backend Developer',
    description: 'Emphasizes API design, database optimization, microservices, and backend performance.',
    roleContext: 'You are a Senior Backend Architect specializing in high-throughput API microservices and database internals.',
    specialInstructions: [
      'Focus on REST/GraphQL API design, SQL query optimization, caching strategies (Redis), and asynchronous message queues.',
      'Highlight data modeling, security standards, and backend latency reductions.'
    ]
  },
  fullstack_developer: {
    id: 'fullstack_developer',
    name: 'Full Stack Developer',
    description: 'Balances end-to-end web architecture, frontend responsiveness, and server-side reliability.',
    roleContext: 'You are a Full Stack Engineering Lead who builds end-to-end scalable web applications.',
    specialInstructions: [
      'Demonstrate seamless end-to-end feature delivery connecting client-side interfaces with robust server infrastructure.',
      'Highlight versatility across frontend frameworks, backend runtimes, and deployment pipelines.'
    ]
  },
  react_developer: {
    id: 'react_developer',
    name: 'React Developer Specialist',
    description: 'Tailored specifically for React, Next.js, Hooks, Redux/Zustand, and modern React ecosystem mastery.',
    roleContext: 'You are a Lead React Architect specializing in React 18, Next.js App Router, and modern React patterns.',
    specialInstructions: [
      'Emphasize custom hooks, React performance optimization (memoization, virtualization), and server component architecture.',
      'Highlight React testing patterns (React Testing Library, Cypress/Playwright).'
    ]
  },
  java_developer: {
    id: 'java_developer',
    name: 'Java Developer',
    description: 'Tailored for enterprise Java, Spring Boot, microservices, JVM tuning, and enterprise patterns.',
    roleContext: 'You are an Enterprise Java Architect specializing in Spring Ecosystem and enterprise microservices.',
    specialInstructions: [
      'Highlight Spring Boot, Spring Cloud, Hibernate/JPA, dependency injection, and JVM performance tuning.',
      'Emphasize enterprise security, multi-threading, and robust unit testing with JUnit/Mockito.'
    ]
  },
  python_developer: {
    id: 'python_developer',
    name: 'Python Developer',
    description: 'Focuses on Pythonic code standards, FastAPI/Django backends, automation, and data pipelines.',
    roleContext: 'You are a Senior Python Architect and Data Engineer specializing in clean Pythonic software design.',
    specialInstructions: [
      'Highlight Pythonic conventions, asynchronous programming (asyncio), Django/FastAPI frameworks, and PyTest coverage.',
      'Emphasize data manipulation, ETL pipelines, and API integrations.'
    ]
  },
  data_analyst: {
    id: 'data_analyst',
    name: 'Data Analyst',
    description: 'Emphasizes SQL queries, data visualization (Tableau/PowerBI), statistical analysis, and business impact.',
    roleContext: 'You are a Lead Business Intelligence Analyst and Data Analytics Manager.',
    specialInstructions: [
      'Highlight complex SQL queries (Window functions, CTEs), data storytelling, BI dashboards, and A/B test analysis.',
      'Quantify business revenue impact, cost savings, and actionable executive insights.'
    ]
  },
  devops_engineer: {
    id: 'devops_engineer',
    name: 'DevOps & Site Reliability Engineer',
    description: 'Focuses on Infrastructure as Code, CI/CD pipelines, Kubernetes, Docker, and system reliability.',
    roleContext: 'You are a Principal SRE and DevOps Architect focused on zero-downtime deployments and infrastructure automation.',
    specialInstructions: [
      'Emphasize Docker containerization, Kubernetes orchestration, Terraform IaC, and automated CI/CD pipelines.',
      'Highlight uptime SLAs, observability (Prometheus/Grafana), and disaster recovery.'
    ]
  },
  cloud_engineer: {
    id: 'cloud_engineer',
    name: 'Cloud Infrastructure Engineer',
    description: 'Tailored for AWS, Azure, GCP cloud architecture, cloud security, and cost optimization.',
    roleContext: 'You are a Multi-Cloud Solutions Architect specialized in AWS/Azure enterprise migrations.',
    specialInstructions: [
      'Highlight cloud-native services (Lambda, S3, EC2, CloudFront), cloud security policies (IAM), and cost governance.',
      'Emphasize cloud migration strategies and high-availability architecture.'
    ]
  },
  remote_jobs: {
    id: 'remote_jobs',
    name: 'Remote Work Optimization',
    description: 'Highlights asynchronous communication, self-direction, remote collaboration tools, and productivity.',
    roleContext: 'You are a Director of Remote Operations evaluating candidates for fully distributed engineering teams.',
    specialInstructions: [
      'Emphasize autonomous execution, clear asynchronous documentation, Slack/Jira hygiene, and self-managed delivery.'
    ]
  },
  startup_jobs: {
    id: 'startup_jobs',
    name: 'High-Growth Startup',
    description: 'Emphasizes rapid prototyping, adaptability, ownership, fast execution, and wearing multiple hats.',
    roleContext: 'You are a Startup Founder and VP of Engineering hiring high-velocity builders.',
    specialInstructions: [
      'Highlight speed of execution, zero-to-one product builds, cross-functional ownership, and customer customer empathy.',
      'Emphasize comfort with ambiguity and rapid iteration.'
    ]
  },
  government_jobs: {
    id: 'government_jobs',
    name: 'Government & Defense Contracting',
    description: 'Focuses on strict compliance, security clearances, standard documentation, and public sector frameworks.',
    roleContext: 'You are a Public Sector Federal Recruiter and Compliance Officer.',
    specialInstructions: [
      'Emphasize NIST standards, FedRAMP compliance, security clearances (if applicable), and thorough formal documentation.'
    ]
  },
  healthcare_jobs: {
    id: 'healthcare_jobs',
    name: 'Healthcare & HealthTech',
    description: 'Highlights HIPAA compliance, medical data security, HL7/FHIR standards, and patient privacy.',
    roleContext: 'You are a HealthTech CTO evaluating systems for HIPAA compliance and clinical data integrations.',
    specialInstructions: [
      'Highlight HIPAA/PHI security compliance, HL7/FHIR protocol integrations, and high-reliability patient data handling.'
    ]
  },
  finance_jobs: {
    id: 'finance_jobs',
    name: 'Fintech & Financial Services',
    description: 'Emphasizes low-latency systems, financial security (PCI-DSS), fraud detection, and transactional accuracy.',
    roleContext: 'You are a Fintech Engineering Executive building high-frequency transaction systems.',
    specialInstructions: [
      'Highlight PCI-DSS security compliance, financial transaction integrity, ledger systems, and low-latency API performance.'
    ]
  }
};
