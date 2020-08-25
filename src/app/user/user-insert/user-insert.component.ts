import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './../../service/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;

@Component({
  selector: 'app-user-insert',
  templateUrl: './user-insert.component.html',
  styleUrls: ['./user-insert.component.css']
})
export class UserInsertComponent implements OnInit {

  public userForm: FormGroup;
  message = '';
  result;
  user;
  dateCreation = new Date();
  personalSpace;

  constructor(private fb: FormBuilder, route: ActivatedRoute, private userService : UserService, private router: Router, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      type: ['', Validators.required],
    });

      this.afAuth.authState.subscribe((user) => { //etat actuel utilisateur connecté
      console.log('user', user);

      this.user = user;
      if (this.user) {
        // console.log(this.db.readPersonalSpaceByUID(user.uid));

        this.userService.readUserWithUID(user.uid).subscribe(
          (data) => {
            console.log('ngOnInt readPersonnalSpaceById / data', data);
            this.personalSpace = data;
            if (!data || data.length === 0) {
              console.log(`Creating a new space for ${user.displayName}`);
  
              this.userService.createAdminUser;
            }
          },
          (err) => {
            console.error('readPersonalSpaceById error', err);
          }
        );
      }
    });
    
  }

  // This methods run when Angular destroy a component (cf component life cycle)
  /*ngOnDestroy(): void {
    this.reservationSubscription.unsubscribe() // We unsubscribe from the observable
  }*/

  async onInsertUser() { //Création dans la base de donnée dans la table user
      
    this.result = await this.afAuth.createUserWithEmailAndPassword(this.userForm.value.email,this.userForm.value.password); //Création dans authentification
    
    const resultRes = await this.userService.createAdminUser(
      this.userForm.value.email,
      this.userForm.value.name,
      this.userForm.value.type,
      this.dateCreation, // Question données provisoire
      // Question 4 Comment récupérer le nouvel id du user qui vient d'être crée ?
    );
     
    console.log('resultRes : ', resultRes);
    
   
    if( this.result && this.result.user) {
      console.log('userCreated', this.result);
      this.result = null;
    }
    
    this.userForm.reset();

    await Toast.show({ 
      text: 'Insertion effectué avec succès!'
    });

    this.router.navigate(['/user']);
  }

}
