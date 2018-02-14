import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from 'angularfire2/firestore';
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
  private itemsCollection: AngularFirestoreCollection<MovieQuote>;
  readonly quotesPath = "quotes";

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
    this.movieQuotesStream = this.itemsCollection.valueChanges();

    //this.movieQuotesStream = db.collection(this.quotesPath).valueChanges();
  }

  onSubmit(): void {
    // Local only solution
    // this.movieQuotes.unshift(this.formMovieQuote);
    try {
      this.itemsCollection.add(this.formMovieQuote);

      //this.movieQuotesStream.push(this.formMovieQuote);

      this.formMovieQuote = {
        'quote': '',
        'movie': ''
      };
    }
    catch (e) {
      console.log("Form error:", e);
    }
  }
}
