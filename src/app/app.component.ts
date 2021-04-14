import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  user: any;
  items: Observable<any[]>;
  formValue: any;

  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore) {
    const query = firestore.collection("messages", ref => {
      return ref.orderBy("createdAt").limitToLast(30);
    });
    this.items = query.valueChanges();
    this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }


  signIn() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.auth.user.subscribe((user) => {
      this.user = user;
    });
  }

  signOut() {
    this.auth.signOut();
    this.user = null;
  }

  sendMessage() {
    this.auth.user.subscribe((user) => {
      this.firestore.collection("messages").add({
        text: this.formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });

      this.formValue = '';
    });
  }

}
