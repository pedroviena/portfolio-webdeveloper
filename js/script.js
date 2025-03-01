const text = document.getElementById('mainTitle');
text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>");

const letters = text.getElementsByTagName('span');
for (let i = 0; i < letters.length; i++) {
    letters[i].style.animationDelay = i * 0.1 + "s";
}

// Add hover effect to tech cards
const cards = document.querySelectorAll('.tech-card');
cards.forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Configuração do Canvas para partículas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Ajusta o canvas para tela inteira
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Array de partículas
let particles = [];

// Classe Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsla(${Math.random() * 60 + 250}, 70%, 50%, 0.3)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.02;

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -0.8;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -0.8;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
    }
}

// Inicializa menos partículas
function init() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

// Anima as partículas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        if (particle.size <= 0.2) {
            particles.splice(index, 1);
            particles.push(new Particle());
        }
    });

    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    resizeCanvas();
    init();
    animate();
});

// Efeito parallax mais suave
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.light-orb');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.01;
        const x = (window.innerWidth - mouseX * speed) / 100;
        const y = (window.innerHeight - mouseY * speed) / 100;
        
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Função para animar os cards de tecnologia
function animateTechCards() {
    const cards = document.querySelectorAll('.tech-card');
    
    // Adiciona delay crescente para cada card
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('appear');
        }, 100 * index);
    });
}

// Remover duplicação do observer e unificar em um único observer
const unifiedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animar tech cards
            if (entry.target.classList.contains('tech-grid')) {
                animateTechCards();
            }
            
            // Animar contadores e expertise
            if (entry.target.classList.contains('about-section')) {
                animateCounters();
                animateExpertise();
            }
            
            // Animar elementos com classe animate-in
            if (entry.target.classList.contains('animate-in-trigger')) {
                const animateElements = entry.target.querySelectorAll('.tech-card, .service-card, .achievement-card');
                animateElements.forEach(element => {
                    element.classList.add('animate-in');
                });
            }
            
            unifiedObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observar elementos relevantes
document.addEventListener('DOMContentLoaded', () => {
    const techGrid = document.querySelector('.tech-grid');
    const aboutSection = document.querySelector('.about-section');
    const animateSections = document.querySelectorAll('.animate-in-trigger');
    
    if (techGrid) unifiedObserver.observe(techGrid);
    if (aboutSection) unifiedObserver.observe(aboutSection);
    animateSections.forEach(section => unifiedObserver.observe(section));
});

// Sistema de About Me
const initAboutMe = () => {
    // Sistema de tabs para habilidades
    const initSkillTabs = () => {
        const aboutTabs = document.querySelectorAll('.tab-btn');
        const skillContents = document.querySelectorAll('.skill-content');

        aboutTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                aboutTabs.forEach(b => b.classList.remove('active'));
                skillContents.forEach(content => content.classList.remove('active'));
                
                btn.classList.add('active');
                const targetContent = document.getElementById(btn.dataset.tab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    animateSkillBars();
                }
            });
        });
    };

    // Animação das barras de progresso
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const parent = bar.parentElement;
            const level = parent.dataset.level || 0;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, 100);
        });
    };

    // Animação dos contadores
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.round(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };

    // Efeito de digitação
    const initTypeWriter = () => {
        const textElement = document.querySelector('.typing-text');
        if (!textElement) return;

        const texts = [
            "Desenvolvedor Full Stack apaixonado por tecnologia",
            "Especialista em criar soluções inovadoras",
            "Sempre em busca de novos desafios"
        ];
        let textIndex = 0;
        
        const updateText = () => {
            textElement.textContent = texts[textIndex];
            textIndex = (textIndex + 1) % texts.length;
        };
        
        updateText();
        setInterval(updateText, 3000);
    };

    // Dados do CV
    const cvData = {
        experience: [
            {
                year: '2023',
                title: 'Desenvolvedor Full Stack Senior',
                company: 'Empresa XYZ',
                details: [
                    'Desenvolvimento de aplicações web escaláveis',
                    'Liderança de equipe de 5 desenvolvedores',
                    'Implementação de CI/CD e práticas ágeis'
                ]
            },
            // Adicione mais experiências
        ],
        education: [
            {
                year: '2020',
                title: 'Bacharel em Ciência da Computação',
                institution: 'Universidade XYZ',
                details: 'Média 9.0 - TCC em Inteligência Artificial'
            }
        ],
        certificates: [
            {
                name: 'AWS Certified Developer',
                date: '2023',
                issuer: 'Amazon',
                image: 'path/to/cert-image.jpg'
            }
            // Adicione mais certificados
        ]
    };

    // Modal do CV
    const initCVModal = () => {
        const modal = document.querySelector('.cv-modal');
        const openBtn = document.querySelector('.view-cv');
        const closeBtn = document.querySelector('.close-modal');
        const downloadBtn = document.querySelector('.download-cv');

        // Abrir modal com animação
        openBtn?.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            renderCVContent('experience'); // Renderiza conteúdo inicial
        });

        // Fechar modal
        closeBtn?.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        });

        // Fechar ao clicar fora
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeBtn.click();
        });

        // Download CV
        downloadBtn?.addEventListener('click', () => {
            // Implemente a lógica de download do seu CV
            window.open('path/to/your/cv.pdf', '_blank');
        });
    };

    // Tabs do CV
    const initCVTabs = () => {
        const tabs = document.querySelectorAll('.cv-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabId = tab.dataset.tab;
                renderCVContent(tabId);
            });
        });
    };

    // Renderizar conteúdo do CV
    const renderCVContent = (tabId) => {
        const contents = document.querySelectorAll('.cv-content');
        contents.forEach(content => content.classList.remove('active'));
        
        const activeContent = document.getElementById(tabId);
        activeContent.classList.add('active');

        // Renderizar timeline
        if (tabId === 'experience' || tabId === 'education') {
            const timeline = activeContent.querySelector('.timeline');
            timeline.innerHTML = ''; // Limpa conteúdo atual
            
            cvData[tabId].forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.dataset.year = item.year;
                
                timelineItem.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.company || item.institution}</p>
                    ${item.details ? Array.isArray(item.details) 
                        ? `<ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul>`
                        : `<p>${item.details}</p>`
                    : ''}
                `;
                
                timeline.appendChild(timelineItem);
                
                // Animar entrada
                setTimeout(() => timelineItem.classList.add('active'), 100 * timeline.children.length);
            });
        }
        
        // Renderizar certificados
        if (tabId === 'certificates') {
            const grid = activeContent.querySelector('.certificates-grid');
            grid.innerHTML = '';
            
            cvData.certificates.forEach(cert => {
                const certCard = document.createElement('div');
                certCard.className = 'certificate-card';
                certCard.innerHTML = `
                    <img src="${cert.image}" alt="${cert.name}">
                    <h4>${cert.name}</h4>
                    <p>${cert.issuer} - ${cert.date}</p>
                `;
                grid.appendChild(certCard);
                
                // Animar entrada
                setTimeout(() => certCard.classList.add('active'), 100 * grid.children.length);
            });
        }
    };

    // Animação de scroll suave para as seções
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Inicializar todas as funcionalidades
    const init = () => {
        initSkillTabs();
        initCVModal();
        initCVTabs();
        initSmoothScroll();
        initAchievementCards();
        initTechPills();
        
        // Observer existente...
    };

    init();
};

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initAboutMe);

const initAchievementCards = () => {
    const cards = document.querySelectorAll('.achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const details = card.querySelector('.achievement-details');
            details.style.opacity = '1';
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            const details = card.querySelector('.achievement-details');
            details.style.opacity = '0';
            card.style.transform = 'translateY(0)';
        });
    });
};

const initTechPills = () => {
    const pills = document.querySelectorAll('.tech-pill');
    
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Aqui você pode adicionar uma função para mostrar projetos
            // relacionados à tecnologia selecionada
        });
    });
};

const animateExpertise = () => {
    const progressBars = document.querySelectorAll('.expertise-progress');
    
    progressBars.forEach(bar => {
        const level = bar.dataset.level;
        setTimeout(() => {
            bar.style.width = `${level}%`;
        }, 300);
    });
};

// Remover duplicação dos event listeners de hover
const initializeHoverEffects = () => {
    // Tech cards hover
    document.querySelectorAll('.tech-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.transform = `
                perspective(1000px)
                rotateX(${(y - rect.height/2) / 20}deg)
                rotateY(${-(x - rect.width/2) / 20}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });

    // Achievement cards hover
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const details = card.querySelector('.achievement-details');
            if (details) {
                details.style.opacity = '1';
                card.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const details = card.querySelector('.achievement-details');
            if (details) {
                details.style.opacity = '0';
                card.style.transform = 'translateY(0)';
            }
        });
    });
};

// Inicializar efeitos de hover uma única vez
document.addEventListener('DOMContentLoaded', initializeHoverEffects);

// Unificar animações de elementos UI
const UIAnimations = {
    // Animação da órbita de tecnologias otimizada
    initTechOrbit() {
        const orbit = document.querySelector('.tech-orbit');
        const icons = orbit.querySelectorAll('.tech-icon');
        
        // Mantém os ícones sempre voltados para cima enquanto orbitam
        icons.forEach((icon, index) => {
            const angle = (360 / icons.length) * index;
            icon.style.transform = `
                rotate(${angle}deg) 
                translateX(120px) 
                rotate(-${angle}deg)
            `;
        });
    },

    // Animação do botão CTA otimizada
    initCTAButton() {
        const ctaButton = document.querySelector('.primary-btn');
        if (!ctaButton) return;

        const particle = document.createElement('div');
        particle.classList.add('btn-particle');
        ctaButton.appendChild(particle);

        ctaButton.addEventListener('mousemove', (e) => {
            const rect = ctaButton.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            requestAnimationFrame(() => {
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.transform = 'scale(1)';
            });
        });

        ctaButton.addEventListener('mouseleave', () => {
            particle.style.transform = 'scale(0)';
        });
    },

    // Animação do círculo SVG otimizada
    animateCircle(element, percentage) {
        if (!element) return;
        
        const circle = element.querySelector('.circle');
        if (!circle) return;

        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (percentage / 100) * circumference;
        
        requestAnimationFrame(() => {
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            // Força um reflow
            circle.getBoundingClientRect();
            
            circle.style.transition = 'stroke-dashoffset 2s ease-out';
            circle.style.strokeDashoffset = offset;
        });
    }
};

// Gerenciamento de loading otimizado
const LoadingManager = {
    init() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        const progress = document.querySelector('.progress');
        
        if (!loadingScreen || !mainContent || !progress) return;

        let width = 0;
        const loadingInterval = setInterval(() => {
            if (width >= 100) {
                clearInterval(loadingInterval);
                this.finishLoading(loadingScreen, mainContent);
            } else {
                width = Math.min(width + Math.random() * 15, 100);
                progress.style.width = width + '%';
            }
        }, 200);
    },

    finishLoading(loadingScreen, mainContent) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
            
            // Inicializar animações após carregamento
            UIAnimations.initTechOrbit();
            UIAnimations.initCTAButton();
        }, 1000);
    }
};

// Inicialização unificada final
document.addEventListener('DOMContentLoaded', () => {
    LoadingManager.init();
    
    // Remover event listeners duplicados
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('scroll', handleScroll);
    
    // Adicionar event listeners otimizados
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Inicializar animações UI
    Object.values(UIAnimations).forEach(animation => {
        if (typeof animation === 'function') {
            animation();
        }
    });

    VanillaTilt.init(document.querySelectorAll(".timeline-node-k129"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.02
    });

    VanillaTilt.init(document.querySelectorAll(".info-card"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.02
    });
});

// Remover duplicação das funções de animação e scroll
function handleScroll() {
    // Combinar todas as verificações de scroll em uma única função
    const elements = document.querySelectorAll('.metric-card, .tech-card, .service-card, .achievement-card');
    
    elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('animated')) {
            // Métricas
            if (element.classList.contains('metric-card')) {
                const counter = element.querySelector('.counter');
                const circularChart = element.querySelector('.circular-chart');
                
                if (counter && counter.dataset.target) {
                    animateCounter(counter);
                }
                
                if (circularChart) {
                    const percentage = counter ? counter.dataset.target : 0;
                    animateCircle(circularChart, percentage);
                }
            }
            
            // Adicionar classe de animação
            element.classList.add('animated');
        }
    });

    // Efeito parallax unificado
    const parallaxElements = document.querySelectorAll('[data-parallax], .light-orb');
    const mouseY = window.scrollY;
    
    parallaxElements.forEach((element, index) => {
        const speed = element.dataset.parallax || (index + 1) * 0.01;
        const y = mouseY * speed;
        element.style.transform = `translateY(${-y}px)`;
    });
}

// Remover duplicação do sistema de cursor personalizado
const initializeCustomCursor = () => {
    const cursor = document.querySelector('.custom-cursor') || document.createElement('div');
    const cursorDot = document.querySelector('.cursor-dot') || document.createElement('div');
    
    if (!document.querySelector('.custom-cursor')) {
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
    }
    
    if (!document.querySelector('.cursor-dot')) {
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);
    }

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
    });

    // Atualizar seletores para elementos interativos uma única vez
    document.querySelectorAll('a, button, .tech-card, .primary-btn, .secondary-btn')
        .forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                element.style.cursor = 'none';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                element.style.cursor = 'auto';
            });
        });

    document.body.classList.add('custom-cursor-enabled');
};

// Inicialização unificada
document.addEventListener('DOMContentLoaded', () => {
    initializeCustomCursor();
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificação inicial
});

// Unificar sistema de smooth scroll
class SmoothScroll {
    constructor() {
        this.current = 0;
        this.target = 0;
        this.ease = 0.075;
        this.container = document.querySelector('.scroll-container');
        this.init();
    }

    init() {
        if (!this.container) return;
        document.body.style.height = `${this.container.getBoundingClientRect().height}px`;
        this.animate();
    }

    animate() {
        this.current = lerp(this.current, this.target, this.ease);
        this.target = window.scrollY;
        
        if (this.container) {
            this.container.style.transform = `translateY(${-this.current}px)`;
            requestAnimationFrame(() => this.animate());
        }
    }
}

const lerp = (start, end, t) => start * (1 - t) + end * t;

// Sistema de notificações unificado
class NotificationSystem {
    constructor() {
        if (document.querySelector('.notification-container')) return;
        
        this.container = document.createElement('div');
        this.container.classList.add('notification-container');
        document.body.appendChild(this.container);
    }

    show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon"></i>
                <p>${message}</p>
            </div>
            <div class="notification-progress"></div>
        `;
        
        this.container.appendChild(notification);
        
        // Usar requestAnimationFrame para animações mais suaves
        requestAnimationFrame(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    }
}

// Singleton para o sistema de notificações
const notifications = new NotificationSystem();

// Unificar sistema de animação de digitação
function typeWriter(element, text, speed = 100) {
    if (!element) return;
    
    let i = 0;
    element.innerHTML = '';
    element.setAttribute('data-typing', 'true');
    
    function type() {
        if (i < text.length && element.getAttribute('data-typing') === 'true') {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
    
    return {
        stop: () => element.setAttribute('data-typing', 'false'),
        restart: () => {
            i = 0;
            element.innerHTML = '';
            element.setAttribute('data-typing', 'true');
            type();
        }
    };
}

// Inicialização unificada dos sistemas
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar smooth scroll apenas se necessário
    if (document.querySelector('.scroll-container')) {
        new SmoothScroll();
    }
    
    // Inicializar typing effect
    const typingElements = document.querySelectorAll('[data-typing-text]');
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing-text');
        if (text) {
            typeWriter(element, text);
        }
    });

    createParticles();
    animateTechIcons();
    handleScroll();

    // Adicionar listeners uma única vez
    window.addEventListener('scroll', handleScroll);
});

// Função para animar os ícones de tecnologia
function animateTechIcons() {
    const icons = document.querySelectorAll('.tech-icon');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.classList.add('animate-in');
        }, index * 200);
    });
}

// Função para verificar se o elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Adicionar listeners
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current > target) {
                current = target;
            }
            counter.textContent = Math.round(current);
            
            if (current < target) {
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    });

    handleScroll();
    window.addEventListener('scroll', handleScroll);
});

// Função para inicializar a seção Interactive Journey
function initInteractiveJourney() {
    const stageCards = document.querySelectorAll('.stage-card');
    const metrics = {
        'code-tested': '95%',
        'uptime': '99.9%',
        'support': '24/7'
    };

    // Adicionar valores às métricas
    document.querySelectorAll('.metric-value').forEach((metric, index) => {
        const values = Object.values(metrics);
        metric.textContent = values[index];
    });

    // Adicionar interatividade aos cards
    stageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remover classe ativa de todos os cards
            stageCards.forEach(c => c.classList.remove('active'));
            // Adicionar classe ativa ao card atual
            card.classList.add('active');
            
            // Animar o ícone
            const icon = card.querySelector('.stage-icon');
            icon.style.animation = 'none';
            icon.offsetHeight; // Trigger reflow
            icon.style.animation = 'pulse 1s';
        });
    });

    // Animação dos ícones de tecnologia
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon, index) => {
        icon.style.transform = `rotate(${index * (360 / techIcons.length)}deg)`;
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initInteractiveJourney();
});

// Adicionar animação de entrada quando a seção estiver visível
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelector('.interactive-journey').classList.add('fade-in');
observer.observe(document.querySelector('.interactive-journey'));

// Função para inicializar as métricas
function initMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    const metrics = ['95%', '99.9%', '24/7'];
    
    metricValues.forEach((metric, index) => {
        metric.textContent = metrics[index];
    });
}

// Função para adicionar interatividade aos cards
function initStageCards() {
    const stageCards = document.querySelectorAll('.stage-card');
    
    stageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Adiciona classe ativa ao card atual
            card.classList.add('active');
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove classe ativa ao sair
            card.classList.remove('active');
        });
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initMetrics();
    initStageCards();
    initTechOrbit();
});

function initConstellation() {
    const container = document.querySelector('.constellation-container');
    const technologies = [
        { icon: 'fa-react', name: 'React', type: 'fab' },
        { icon: 'fa-js', name: 'JavaScript', type: 'fab' },
        { icon: 'fa-php', name: 'PHP', type: 'fab' },
        { icon: 'fa-wordpress', name: 'WordPress', type: 'fab' },
        { icon: 'fa-node-js', name: 'Node.js', type: 'fab' },
        { icon: 'fa-database', name: 'PostgreSQL', type: 'fas', customClass: 'tech-postgres' },
        { icon: 'fa-code', name: 'TypeScript', type: 'fas', customClass: 'tech-typescript' }
    ];

    // Adicionar partículas de fundo
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
    }

    // Criar e posicionar os nós
    technologies.forEach((tech, index) => {
        const node = document.createElement('div');
        node.className = `tech-node ${tech.customClass || ''}`;
        
        // HTML personalizado para PostgreSQL e TypeScript
        if (tech.name === 'PostgreSQL') {
            node.innerHTML = `
                <div class="tech-icon-wrapper">
                    <i class="${tech.type} ${tech.icon}"></i>
                    <span class="tech-name">Postgres</span>
                </div>
            `;
        } else if (tech.name === 'TypeScript') {
            node.innerHTML = `
                <div class="tech-icon-wrapper">
                    <span class="ts-icon">TS</span>
                    <span class="tech-name">TypeScript</span>
                </div>
            `;
        } else {
            node.innerHTML = `
                <div class="tech-icon-wrapper">
                    <i class="${tech.type} ${tech.icon}"></i>
                    <span class="tech-name">${tech.name}</span>
                </div>
            `;
        }
        
        // Posicionamento em círculo com movimento flutuante
        const angle = (2 * Math.PI * index) / technologies.length;
        const radius = 130;
        const centerX = container.clientWidth / 2;
        const centerY = container.clientHeight / 2;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        node.style.left = `${x - 40}px`;
        node.style.top = `${y - 40}px`;
        
        // Animação única para cada nó
        node.style.animation = `float ${4 + index}s infinite ease-in-out ${index * 0.5}s`;
        
        container.appendChild(node);

        // Adicionar interatividade
        node.addEventListener('mouseenter', () => {
            // Criar efeito de onda
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            node.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);

            // Destacar conexões
            const lines = container.querySelectorAll('.constellation-line');
            lines.forEach(line => {
                if (line.dataset.from === index.toString() || line.dataset.to === index.toString()) {
                    line.style.opacity = '1';
                    line.style.height = '3px';
                } else {
                    line.style.opacity = '0.2';
                }
            });
        });

        node.addEventListener('mouseleave', () => {
            const lines = container.querySelectorAll('.constellation-line');
            lines.forEach(line => {
                line.style.opacity = '0.5';
                line.style.height = '2px';
            });
        });
    });

    // Criar linhas de conexão
    const nodes = container.querySelectorAll('.tech-node');
    nodes.forEach((node, i) => {
        nodes.forEach((targetNode, j) => {
            if (i < j) {
                const line = document.createElement('div');
                line.className = 'constellation-line';
                line.dataset.from = i.toString();
                line.dataset.to = j.toString();
                
                const updateLine = () => {
                    const rect1 = node.getBoundingClientRect();
                    const rect2 = targetNode.getBoundingClientRect();
                    
                    const x1 = rect1.left + rect1.width / 2;
                    const y1 = rect1.top + rect1.height / 2;
                    const x2 = rect2.left + rect2.width / 2;
                    const y2 = rect2.top + rect2.height / 2;
                    
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                    
                    line.style.width = `${length}px`;
                    line.style.left = `${x1}px`;
                    line.style.top = `${y1}px`;
                    line.style.transform = `rotate(${angle}deg)`;
                };
                
                updateLine();
                window.addEventListener('resize', updateLine);
                container.appendChild(line);
            }
        });
    });
}

// Atualizar a inicialização
document.addEventListener('DOMContentLoaded', () => {
    initMetrics();
    initStageCards();
    initConstellation();
}); 

document.addEventListener('DOMContentLoaded', () => {
    const geometricLines = document.querySelector('.geometric-lines svg');
    const numberOfLines = 5; // Você pode ajustar o número de linhas
    
    // Limpa o SVG existente
    geometricLines.innerHTML = '';
    
    // Função para gerar um ponto aleatório dentro dos limites
    const randomPoint = () => {
        return {
            x: Math.random() * 100,
            y: Math.random() * 100
        };
    };
    
    // Função para criar uma nova linha com pontos aleatórios
    const createLine = () => {
        const start = randomPoint();
        const end = randomPoint();
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        path.setAttribute('class', 'line-path');
        path.setAttribute('d', `M${start.x},${start.y} L${end.x},${end.y}`);
        
        return path;
    };
    
    // Cria as linhas iniciais
    for (let i = 0; i < numberOfLines; i++) {
        const line = createLine();
        geometricLines.appendChild(line);
    }
    
    // Atualiza as linhas periodicamente
    setInterval(() => {
        geometricLines.innerHTML = ''; // Limpa as linhas existentes
        
        // Cria novas linhas
        for (let i = 0; i < numberOfLines; i++) {
            const line = createLine();
            geometricLines.appendChild(line);
        }
    }, 5000); // Atualiza a cada 5 segundos
    
    // Adiciona interatividade com o mouse
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        // Atualiza a posição das linhas com base no movimento do mouse
        const lines = geometricLines.querySelectorAll('.line-path');
        lines.forEach((line, index) => {
            const start = randomPoint();
            const end = {
                x: mouseX + (Math.random() - 0.5) * 20,
                y: mouseY + (Math.random() - 0.5) * 20
            };
            
            line.setAttribute('d', `M${start.x},${start.y} L${end.x},${end.y}`);
        });
    });
});

// Controle do Slider de Depoimentos
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // 32px é o gap
    const maxIndex = cards.length - Math.floor(slider.offsetWidth / cardWidth);

    // Atualiza os botões de navegação
    function updateNavigation() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        // Atualiza indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Move o slider
    function moveSlider(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        updateNavigation();
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => moveSlider(currentIndex - 1));
    nextBtn.addEventListener('click', () => moveSlider(currentIndex + 1));
    
    // Clique nos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => moveSlider(index));
    });

    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar como swipe
            if (diff > 0) {
                moveSlider(currentIndex + 1);
            } else {
                moveSlider(currentIndex - 1);
            }
        }
    });

    // Atualiza navegação inicial
    updateNavigation();

    // Atualiza em caso de redimensionamento da janela
    window.addEventListener('resize', () => {
        // Recalcula valores
        const newCardWidth = cards[0].offsetWidth + 32;
        const newMaxIndex = cards.length - Math.floor(slider.offsetWidth / newCardWidth);
        
        // Atualiza variáveis
        currentIndex = Math.min(currentIndex, newMaxIndex);
        moveSlider(currentIndex);
    });
});

// Sistema de Serviços Otimizado
const initServiceCards = () => {
    // Verifica se o VanillaTilt está disponível antes de inicializar
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".solution-card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.02,
            transition: true,
            easing: "cubic-bezier(.03,.98,.52,.99)",
            perspective: 1000
        });
    }

    // Configuração do Observer para animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                serviceObserver.unobserve(entry.target); // Desregistra após animar
            }
        });
    }, observerOptions);

    // Aplicar animações aos cards
    document.querySelectorAll('.solution-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        serviceObserver.observe(card);
    });

    // Animação das tech-pills
    document.querySelectorAll('.tech-orbit').forEach(orbit => {
        const pills = orbit.querySelectorAll('.tech-pill');
        pills.forEach((pill, index) => {
            const angle = (360 / pills.length) * index;
            pill.style.transform = `rotate(${angle}deg) translateX(60px) rotate(-${angle}deg)`;
        });
    });
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initServiceCards);

// Animação do workflow
document.addEventListener('DOMContentLoaded', () => {
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const canvas = document.getElementById('workflowCanvas');
    const ctx = canvas.getContext('2d');
    
    // Configuração do canvas
    function setupCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    // Animação das partículas no canvas
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `hsla(${Math.random() * 60 + 250}, 70%, 50%, 0.8)`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Criar array de partículas
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Função de animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Observador de interseção para animação dos steps
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.3 });
    
    workflowSteps.forEach(step => {
        observer.observe(step);
    });
    
    // Inicialização
    setupCanvas();
    animate();
    
    // Redimensionamento
    window.addEventListener('resize', setupCanvas);
});

// Contador animado para as estatísticas
function animateValue(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = range / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = `${Math.round(current)}%`;
    }, 16);
}

// Iniciar animação das estatísticas quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const endValue = parseInt(stat.textContent);
                animateValue(stat, 0, endValue, 1500);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.workflow-stats');
statsObserver.observe(statsSection);

// Workflow Animation System
class WorkflowAnimation {
    constructor() {
        this.canvas = document.getElementById('workflowCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.steps = document.querySelectorAll('.workflow-step');
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupIntersectionObserver();
        this.animate();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.createParticles();
        });
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor(this.canvas.width * this.canvas.height / 10000);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                hue: Math.random() * 60 + 240 // Blue to purple range
            });
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, options);

        this.steps.forEach(step => {
            step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(step);
        });
    }

    setupEventListeners() {
        this.steps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                this.highlightConnections(step.dataset.step);
            });

            step.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        });
    }

    highlightConnections(stepNumber) {
        // Adiciona efeito de destaque nas conexões
        this.connections.forEach(conn => {
            if (conn.from === stepNumber || conn.to === stepNumber) {
                conn.highlighted = true;
            }
        });
    }

    resetConnections() {
        this.connections.forEach(conn => {
            conn.highlighted = false;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualiza e desenha partículas
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce nas bordas
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Desenha partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 50%, 0.5)`;
            this.ctx.fill();
        });

        // Desenha conexões
        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `hsla(${p1.hue}, 70%, 50%, ${1 - distance / 100})`;
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Inicializa a animação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new WorkflowAnimation();
});

document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Abre o item clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Vanilla Tilt
    VanillaTilt.init(document.querySelectorAll(".skill-card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
    });

    // Sistema de Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillContents = document.querySelectorAll('.skill-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            skillContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Animação das barras de progresso
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 300);
        });
    }

    // Observer para iniciar animação quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-content').forEach(content => {
        observer.observe(content);
    });

    // Iniciar animação inicial
    animateProgressBars();
});

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress');
    const percentage = document.querySelector('.percentage');
    const statusMessage = document.querySelector('.status-message');
    
    const messages = [
        'Inicializando',
        'Carregando recursos',
        'Preparando conteúdo',
        'Finalizando'
    ];
    
    let progress = 0;
    const duration = 2000; // 2 segundos para carregar
    const interval = 20; // Atualiza a cada 20ms
    const step = 100 / (duration / interval);
    
    function updateProgress() {
        progress = Math.min(progress + step, 100);
        progressBar.style.width = `${progress}%`;
        percentage.textContent = `${Math.round(progress)}%`;
        
        // Atualiza mensagem baseado no progresso
        const messageIndex = Math.floor((progress / 100) * messages.length);
        if (messages[messageIndex]) {
            statusMessage.textContent = messages[messageIndex];
        }
        
        if (progress < 100) {
            setTimeout(updateProgress, interval);
        } else {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }
    
    // Inicia o progresso após um pequeno delay
    setTimeout(updateProgress, 300);
});

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do Tilt
    VanillaTilt.init(document.querySelectorAll(".portfolio-card"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.02
    });

    // Filtro de Projetos
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-tech') === filter || 
                    item.getAttribute('data-year') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
});

// Atualização da função que controla o progresso
function updateCarousel(index) {
    // ... existing code ...

    // Atualizar barra de progresso
    const progress = (index / (totalSlides - 1)) * 100;
    const progressLine = document.querySelector('.progress-line');
    progressLine.style.width = `${progress}%`;
    
    // Adicionar efeito de brilho
    progressLine.style.boxShadow = `0 0 10px rgba(157, 78, 221, ${progress/200 + 0.3})`;
}

// Adicionar animação de pulso à barra de progresso
function addProgressPulse() {
    const progressLine = document.querySelector('.progress-line');
    progressLine.style.transform = 'scaleX(1.03)';
    setTimeout(() => {
        progressLine.style.transform = 'scaleX(1)';
    }, 200);
}

// Atualizar os event listeners
prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
    addProgressPulse();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
    addProgressPulse();
});

