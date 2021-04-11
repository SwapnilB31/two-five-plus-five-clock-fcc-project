import React from 'react'
import './Clock.css'
import {FaArrowUp, FaArrowDown,FaPlayCircle,FaPauseCircle,FaRedoAlt} from 'react-icons/fa'

const clockStates = Object.freeze({
    session_state : 'Session',
    break_state : 'Break'
})

const clockLimits = Object.freeze({
    max_time : 60 * 60 * 1000,
    min_time : 60 * 1000 
})

const initState = Object.freeze({
    running : false,
    session_length : 25 * 60 * 1000,
    break_length : 5 * 60 * 1000,
    state : clockStates.session_state,
    session_time_left : 25 * 60 * 1000,
    break_time_left : 5 * 60 * 1000
})

class BreakClock extends React.Component {

    constructor(props) {
        super(props)
        this.state = Object.assign({},initState)
        this.reset = this.reset.bind(this)
        this.clockStart = this.clockStart.bind(this)
        this.clockStop = this.clockStop.bind(this)
        this.incBreakLength = this.incBreakLength.bind(this)
        this.decBreakLength = this.decBreakLength.bind(this)
        this.incSessionLength = this.incSessionLength.bind(this)
        this.decSessionLength = this.decSessionLength.bind(this)
    }

    componentDidMount() {
        /*const audioElem = document.getElementById('beep')
        audioElem.load()*/
    }

    reset() {
        if(this.interval_)
            clearInterval(this.interval_)
        this.setState(Object.assign({},initState))
        this.pauseBeep()
    }

    clockStart() {
        this.setState({
            running : true
        })
        if(this.state.state === clockStates.session_state) {
            this.startSession()
        }
        else if(this.state.state === clockStates.break_state) {
            this.startBreak()
        }
    }

    clockStop() {
        this.setState({
            running : false
        })
        if(this.state.state === clockStates.session_state) {
            this.stopSession()
        }
        else if(this.state.state === clockStates.break_state) {
            this.stopBreak()
        }
    }

    startSession() {
        
        this.interval_ = setInterval(() => {
            let session_time_left_local = this.state.session_time_left
            session_time_left_local -= 1000
            this.setState(state =>({
                session_time_left : session_time_left_local
            }))

            if(session_time_left_local === -1000) {
                clearInterval(this.interval_)
                this.setState({
                    state : clockStates.break_state,
                    session_time_left : this.state.session_length
                })
                this.playBeep()
                this.startBreak()
            }
        },1000)
    }

    stopSession() {
        clearInterval(this.interval_)
    }

    startBreak() {
        this.interval_ = setInterval(() => {
            let break_time_left_local = this.state.break_time_left
            break_time_left_local -= 1000
            this.setState(state =>({
                break_time_left : break_time_left_local
            }))

            if(break_time_left_local === -1000) {
                clearInterval(this.interval_)
                this.setState({
                    state : clockStates.session_state,
                    break_time_left : this.state.break_length
                })
                this.playBeep()
                this.startSession()
            }
        },1000)
    }

    stopBreak() {
        clearInterval(this.interval_)
    }

    incBreakLength() {
        if(this.state.running)
            return
        this.setState(state => {
            if(state.break_length < clockLimits.max_time)
            return {
                break_length : state.break_length + 1000 * 60,
                break_time_left : state.break_length + 1000 * 60
            }
            else
                return {}
        })
    }

    decBreakLength() {
        if(this.state.running)
            return
        this.setState(state => {
            if(state.break_length > clockLimits.min_time)
            return {
                break_length : state.break_length - 1000 * 60,
                break_time_left : state.break_length - 1000 * 60
            }
            else return {}
        })
    }

    incSessionLength() {
        if(this.state.running)
            return
        this.setState(state => {
            if(state.session_length < clockLimits.max_time)
            return {
                session_length : state.session_length + 1000 * 60,
                session_time_left : state.session_length + 1000 * 60
            }
            else
                return {}
        })
    }

    decSessionLength() {
        if(this.state.running)
            return
        this.setState(state => {
            if(state.session_length > clockLimits.min_time)
            return {
                session_length : state.session_length - 1000 * 60,
                session_time_left : state.session_length - 1000 * 60
            }
            else
                return {}
        })
    }

    playBeep() {
        const audioElem = document.getElementById('beep')
        audioElem.currentTime = 0;
        audioElem.play()
    }

    pauseBeep() {
        const audioElem = document.getElementById('beep')
        audioElem.currentTime = 0;
        audioElem.pause()
    }

    render() {
        return (
            <div className="container">
                <audio 
                    src="https://github.com/SwapnilB31/drum-machine--fcc-project-sounds/blob/main/alarm%20sound/alarm-clock-sound.mp3?raw=true"
                    id="beep"
                ></audio>
                <div className="clock-body">
                    <div className="header">25 + 5 Clock</div>
                    <div className="timer-control">
                        <div className="break-control">
                            <div id="break-label">Break Length</div>
                            <div className="break-stats">
                                <div className="break-length-display">{this.state.break_length / (60 * 1000)}</div>
                                <button 
                                    id="break-decrement" 
                                    onClick={this.decBreakLength}
                                    title="Decrement Break Length"
                                >
                                    <FaArrowDown/>
                                </button>
                                <button 
                                    id="break-increment" 
                                    onClick={this.incBreakLength}
                                    title="Increment Break Length"
                                >
                                    <FaArrowUp/>
                                </button>
                            </div>
                        </div>
                        <div className="session-control">
                            <div id="session-label">Session Length</div>
                            <div className="session-stats">
                                <div className="session-length-display">{this.state.session_length / (60 * 1000)}</div>
                                <button 
                                    id="session-decrement" 
                                    onClick={this.decSessionLength}
                                    title="Decrement Session Length"
                                >
                                    <FaArrowDown/>
                                </button>
                                <button 
                                    id="session-increment" 
                                    onClick={this.incSessionLength}
                                    title="Increment Session Length"
                                >
                                    <FaArrowUp/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="timer-container">
                        <div id="timer-label">{this.state.state}</div>
                        <div id="time-left">{toMMSS(this.state.state === clockStates.session_state ? this.state.session_time_left : this.state.break_time_left)}</div>
                    </div>
                    <div className="timer-controls">
                        <button 
                            id="start-stop"
                            onClick={
                                () => {
                                    if(!this.state.running)
                                        this.clockStart()
                                    else
                                        this.clockStop()
                                }
                            }
                            title={this.state.running ? 'Stop' : 'Start'}
                        >{this.state.running ? <FaPauseCircle/> : <FaPlayCircle/>}</button>
                        <button id="reset" onClick={this.reset} title="Reset"><FaRedoAlt/></button>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * @param {Number} time_left
 */
function toMMSS(time_left) {
    const tl = time_left /1000
    let min = parseInt(Math.floor(tl/60))
    min = min < 10 ? `0${min}` : `${min}`
    let sec = tl % 60;
    sec = sec < 10 ? `0${sec}` : `${sec}`

    return `${min}:${sec}`
}

export default BreakClock
