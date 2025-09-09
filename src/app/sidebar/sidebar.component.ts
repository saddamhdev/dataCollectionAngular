import { Component, AfterViewInit, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Sidebar toggle logic
      $('#menuBtn').on('click', function (e) {
        e.stopPropagation();
        $('#sidebar').toggleClass('-translate-x-full');
        $('#overlay').toggleClass('hidden');
      });

      $('#sidebar').on('click', function (e) {
        e.stopPropagation();
      });

      $('body').on('click', function () {
        $('#sidebar').addClass('-translate-x-full');
        $('#overlay').addClass('hidden');
      });

      $('#overlay').on('click', function () {
        $('#sidebar').addClass('-translate-x-full');
        $('#overlay').addClass('hidden');
      });

      // ✅ Dark Mode Handling
      function applyTheme(theme: string) {
        if (theme === 'dark') {
            $('html').addClass('dark');
            $('body').addClass('bg-gray-900 text-white');
            
            // Set header to transparent so sidebar can "visually overlap"
            $('header').removeClass('bg-white').addClass('bg-gray-800 text-white');

            // Sidebar dark styling
            $('.leftSidebar')
              .removeClass('bg-white text-black')
              .addClass('bg-gray-800 z-50 text-white');

            $('#themeToggle').text('Switch to Light Mode');
            } else {
              $('html').removeClass('dark');
              $('body').removeClass('bg-gray-900 text-white');

              // Restore header background
              $('header').removeClass('bg-gray-800 text-white').addClass('bg-white text-black');

              // Sidebar light styling
              $('.leftSidebar')
                .removeClass('bg-gray-800 z-50 text-white')
                .addClass('bg-white text-black');

              $('#themeToggle').text('Switch to Dark Mode');
            }
      }

      const storedTheme = localStorage.getItem('theme') || 'light';
      applyTheme(storedTheme);

      $('#themeToggle').on('click', function (e) {
        e.preventDefault();
        const current = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', current);
        applyTheme(current);
      });
    }
  }
}
