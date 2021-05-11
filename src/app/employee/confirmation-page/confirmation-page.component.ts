import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.css']
})
export class ConfirmationPageComponent implements OnInit {

  statusCode: number = 0;
  errorMessage: string;
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams.token);
    this.authService.sendConfirmationToken(this.route.snapshot.queryParams.token).subscribe(data => {
      this.errorMessage = data.message;
      setTimeout(() => {
        console.log('sleep');
        this.router.navigate(['login']);
      }, 2000);
      console.log(data);
    }, err => {
      if(err.status == 404){
        this.statusCode = 404;
      }
      this.errorMessage = err.error.message;
      console.log(err)
    });
  }

}
