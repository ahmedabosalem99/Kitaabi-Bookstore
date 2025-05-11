import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cancel',
  imports: [RouterModule],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent implements OnInit {
  ngOnInit(): void {
      localStorage.removeItem("order");
      localStorage.removeItem("cartId");
      localStorage.removeItem("stripe_session_id");
  }
}
