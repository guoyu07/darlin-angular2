import {
  Component,
  OnInit,
  AfterViewInit,
  Injectable,
  ViewChild,
  ElementRef
} from '@angular/core'
import {
  Music
} from 'app/base/api/music.api'
import { darlinDB } from 'app/base/indexdb'
import {
  Delete,
  Play,
  Add
} from 'app/share/icon'

@Component({
  selector: 'music',
  templateUrl: './music.template.html',
  styles: [
    require('./music.less')
  ],
  providers: [Music]
})
@Injectable()
export class MusicComponent implements OnInit, AfterViewInit {

  @ViewChild('audio') audio: ElementRef

  public icon = {
    delete: Delete,
    play: Play,
    add: Add
  }

  selectedSong = <any>{}

  show = false

  songs = []

  searchSongs = []

  trackByFn(index, item) {
    return item.id
  }

  addToSongs(song) {
    if (this.songs.filter((s) => s.id === song.id).length > 0) {
      console.warn('已在列表中')
      return
    }
    this.songs.push(song)
    darlinDB.addSong(song)
    // add song to indexDB
  }

  removeSong(song, event) {
    if (song.id === this.selectedSong) {
      this.next()
    }

    darlinDB.removeSong(song)
    this.songs = this.songs.filter((s) => s.id !== song.id)
    event.stopPropagation()
  }

  playInsearch(song) {
    this.addToSongs(song)
    this.select(song)
  }

  get songURL() {
    if (!this.selectedSong.id) {
      return ''
    }
    return `http://ws.stream.qqmusic.qq.com/${this.selectedSong.id}.m4a?fromtag=46`
  }

  select(song) {
    this.selectedSong = song
  }

  search(key: string) {
    if (!key) {
      return
    }
    return this.music.search(key)
      .then(songs => {
        this.searchSongs = songs
      })
  }

  next() {
    let index = -1
    let toSelect
    const len = this.songs.length
    this.songs.forEach((song, i) => {
      if (song.id === this.selectedSong.id) {
        index = i
      }
    })
    if (index + 1 < len) {
      toSelect = index + 1
    } else {
      toSelect = 0
    }
    this.select(this.songs[toSelect])
  }

  constructor(private music: Music) { }

  ngOnInit() {
    // get songs from indexDB
    darlinDB.getSongs$.subscribe(songs => {
      this.songs = songs
    })

    darlinDB.initDB$.subscribe(db => {
      darlinDB.getSongs()
    })

    darlinDB.initDB()
  }

  ngAfterViewInit() {
    this.audio.nativeElement.addEventListener('ended', () => {
      this.next()
    })
  }
}
