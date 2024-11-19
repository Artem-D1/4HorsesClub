class LoopedSlider {
    constructor(container, autoPlayDuration = 7000) {
        this.container = container;
        this.slidesTrack = container.querySelector('.members_blog__slides-track');
        this.originalSlides = Array.from(container.querySelectorAll('.members_blog__slide'));
        this.prevBtn = container.querySelector('.members_blog__prev-btn');
        this.nextBtn = container.querySelector('.members_blog__next-btn');
        this.currentCounter = container.querySelector('.current');
        this.totalCounter = container.querySelector('.total');
        
        this.currentIndex = 1;

        if (window.innerWidth < 1366) {
            this.slideCount = this.originalSlides.length;
        } else {
            this.slideCount = this.originalSlides.length/3;
        }
        this.autoPlayDuration = autoPlayDuration;
        this.autoPlayTimer = null;
        this.isTransitioning = false;
        
        this.slideOffset = 20;
        this.slideWidth = this.container.offsetWidth;
        
        this.init();
    }
    
    init() {
        this.setupInfiniteLoop();
        this.updateSlidePosition(false);
        if (window.innerWidth < 1366) {
            this.totalCounter.textContent = ' ' + this.slideCount;
        } else {
            this.totalCounter.textContent = ' ' + this.slideCount * 3;
        }
        this.updateCounter();
        this.addEventListeners();
        this.startAutoPlay();
        
        window.addEventListener('resize', () => {
            this.updateSlidePosition(false);
        });
    }
    
    setupInfiniteLoop() {
        const firstClone = this.originalSlides[0].cloneNode(true);
        const secondClone = this.originalSlides[1].cloneNode(true);
        const thirdClone = this.originalSlides[2].cloneNode(true);
        const lastClone = this.originalSlides[this.originalSlides.length - 1].cloneNode(true);
        const secondLastClone = this.originalSlides[this.originalSlides.length - 2].cloneNode(true);
        const thirdLastClone = this.originalSlides[this.originalSlides.length - 3].cloneNode(true);
        
        if (window.innerWidth < 1366) {
            this.slidesTrack.insertBefore(lastClone, this.slidesTrack.firstChild);
            this.slidesTrack.appendChild(firstClone);
        } else {
            this.slidesTrack.insertBefore(lastClone, this.slidesTrack.firstChild);
            this.slidesTrack.insertBefore(secondLastClone, this.slidesTrack.firstChild);
            this.slidesTrack.insertBefore(thirdLastClone, this.slidesTrack.firstChild);
            
            this.slidesTrack.appendChild(firstClone); 
            this.slidesTrack.appendChild(secondClone);
            this.slidesTrack.appendChild(thirdClone);  
        }
        
        let totalWidth;
        if (window.innerWidth < 1366) {
            totalWidth = (this.slideCount + 2) * (this.slideWidth + this.slideOffset);
        } else {
            totalWidth = (this.slideCount * 2) * (394 + this.slideOffset);
        }

        this.slidesTrack.style.width = `${totalWidth}px`;
        
        this.updateSlidePosition(false);
    }
    
    updateSlidePosition(animate = true) {
        if (!animate) {
            this.slidesTrack.style.transition = 'none';
        } else {
            this.slidesTrack.style.transition = 'transform 0.5s ease-in-out';
        }
        
        const position = this.currentIndex * (this.slideWidth + this.slideOffset);
        
        this.slidesTrack.style.transform = `translateX(-${position}px)`;
        
        if (!animate) {
            this.slidesTrack.offsetHeight; 
            this.slidesTrack.style.transition = '';
        }
        
        this.updateCounter();
    }
    
    handleTransitionEnd() {
        this.isTransitioning = false;
        if (this.currentIndex === 0) {
            this.currentIndex = this.slideCount;
            this.updateSlidePosition(false);
        } else if (this.currentIndex === this.slideCount + 1) {
            this.currentIndex = 1;
            this.updateSlidePosition(false);
        }
    }
    
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.slidesTrack.addEventListener('transitionend', () => this.handleTransitionEnd());
        
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    updateCounter() {
        let displayIndex;
        if (window.innerWidth < 1366) {
            displayIndex = this.currentIndex === 0 ? this.slideCount : 
                           this.currentIndex === this.slideCount + 1 ? 1 : 
                           this.currentIndex;
        } else {
            displayIndex = this.currentIndex === 0 ? this.slideCount * 3 : 
                           this.currentIndex === this.slideCount + 1 ? 3 : 
                           this.currentIndex * 3;
        }
        this.currentCounter.textContent = displayIndex + ' ';
    }
    
    goToSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateSlidePosition();
        this.startAutoPlay();
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex++;
        this.updateSlidePosition();
        this.startAutoPlay();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex--;
        this.updateSlidePosition();
        this.startAutoPlay();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.autoPlayDuration);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
}


class HorizontalSlider {
    constructor(container) {
        this.container = container;
        this.slidesTrack = container.querySelector('.stage_blog__slides-track');
        this.slides = container.querySelectorAll('.stage_blog__slide');
        this.prevBtn = container.querySelector('.stage_blog__prev-btn');
        this.nextBtn = container.querySelector('.stage_blog__next-btn');
        this.dotsContainer = container.querySelector('.stage_blog__slider-dots');
        
        this.currentSlide = 0;
        this.slideWidth = this.container.offsetWidth;
        
        this.init();
    }
    
    init() {
        if (window.innerWidth < 1366) {
            this.slidesTrack.style.width = `${this.slides.length * this.slideWidth}px`;
        } else {
            this.slidesTrack.style.width = `${this.slideWidth}px`;
        }
        
        this.createDots();
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        window.addEventListener('resize', () => {
            this.slideWidth = this.container.offsetWidth;
            this.goToSlide(this.currentSlide, false);
        });

        this.updateButtonStates();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateButtonStates() {
        if (this.currentSlide === 0) {
            this.prevBtn.classList.add('disabled');
            this.prevBtn.disabled = true;
        } else {
            this.prevBtn.classList.remove('disabled');
            this.prevBtn.disabled = false;
        }

        if (this.currentSlide === this.slides.length - 1) {
            this.nextBtn.classList.add('disabled');
            this.nextBtn.disabled = true;
        } else {
            this.nextBtn.classList.remove('disabled');
            this.nextBtn.disabled = false;
        }
    }
    
    goToSlide(index, animate = true) {
        if (index >= this.slides.length) {
        } else if (index < 0) {
            index = this.slides.length - 1;
        }
        
        this.currentSlide = index;
        
        const translation = -this.currentSlide * this.slideWidth;
        
        if (!animate) {
            this.slidesTrack.style.transition = 'none';
        }
        
        this.slidesTrack.style.transform = `translateX(${translation}px)`;
        
        if (!animate) {
            this.slidesTrack.offsetHeight;
            this.slidesTrack.style.transition = '';
        }
    
        this.updateDots();

        this.updateButtonStates();
    }
    
    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const sliderContainer = document.querySelector('.stage_blog__slider-container');
    const slider = new HorizontalSlider(sliderContainer);

    const sliderContainerLooped = document.querySelector('.members_blog');
    const sliderLooped = new LoopedSlider(sliderContainerLooped, 4000);
});
