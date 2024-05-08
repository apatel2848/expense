import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-report-table-loader",
  template: `
  <div   class="animate-pulse p-6">
          <div class="flex items-center w-full"> 
            <table class="w-full">
              <tr>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
              </tr>
              <tr>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
              </tr>
              <tr>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
              </tr>
              <tr>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
              </tr>
              <tr>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
                <td class="pb-4"><div class="h-2.5 p-1-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div></td>
              </tr> 
            </table>
          </div>
        </div>
        `,
  styleUrls: ["./report-table-loader.component.scss"],
  standalone: true,
  imports: [CommonModule]
})
export class ReportTableLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }
}
