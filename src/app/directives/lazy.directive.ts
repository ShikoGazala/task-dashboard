import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imgElement = this.el.nativeElement;
          this.renderer.setAttribute(imgElement, 'src', imgElement.getAttribute('data-src'));
          this.observer.unobserve(imgElement);
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }
}