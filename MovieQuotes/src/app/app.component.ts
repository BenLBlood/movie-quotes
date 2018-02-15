import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface MovieQuote {
  movie: string;
  quote: string;
  $key?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private itemDoc: AngularFirestoreDocument<MovieQuote>;
  private itemsCollection: AngularFirestoreCollection<MovieQuote>;
  readonly quotesPath = "quotes";
  readonly collectionPath = "collection"

  formMovieQuote: MovieQuote = {
    'quote': '',
    'movie': ''
  };

  // Local only solution
  // movieQuotes: MovieQuote[] = [
  //   {"movie": "Rocky", "quote": "Yo Adrian"},
  //   {"movie": "Terminator", "quote": "I'll be back"},
  //   {"movie": "Titanic", "quote": "I'm the king of the world!"},
  //   {"movie": "The Princess Bride", "quote": "Hello. My name is Inigo Montoya. You killed my father. Prepare to die."}
  // ];

  movieQuotesStream: Observable<MovieQuote[]>;
  constructor(db: AngularFirestore) {
    this.itemsCollection  = db.collection<MovieQuote>(this.quotesPath);
    
    this.movieQuotesStream = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as MovieQuote;
        const $key = a.payload.doc.id;
        return { $key, ...data };
      });
    });
    //this.movieQuotesStream = this.itemsCollection.valueChanges();

  }

  onSubmit(): void {
    // Local only solution
    // this.movieQuotes.unshift(this.formMovieQuote);
    try {
      if (this.formMovieQuote.$key) {
        this.itemsCollection.doc(this.formMovieQuote.$key).update(this.formMovieQuote);
      } else {
        this.itemsCollection.add(this.formMovieQuote);
      }
      this.formMovieQuote = {
        'quote': '',
        'movie': ''
      };
    }
    catch (e) {
      console.log("Form error:", e);
    }
  }

  edit(movieQuote: MovieQuote): void {
    this.formMovieQuote = movieQuote;
  }

  remove(movieQuote: MovieQuote): void {
    console.log(movieQuote);
    this.itemsCollection.doc(movieQuote.$key).delete();
  }
}
