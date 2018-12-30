import React, { Component } from 'react'
import { View, Keyboard, ScrollView, Text, StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import ProgressBar from '../components/ProgressBar'
import BackgroundProgress from '../components/BackgroundProgress'
import Sound from 'react-native-sound'

const alert = require('../../assets/sounds/alert.wav')

class IsometriaScreen extends Component{
    state = {
        keyboardIsVisible: false,

        goal: 1,
        countdown: 1,
        time: '20',

        isRunning: false,
        paused: false,
        countdownValue: 0,
        count: 0
    }
    componentDidMount(){
        Sound.setCategory('Playback', true)
        this.alert = new Sound(alert)

        this.kbShow = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({ keyboardIsVisible: true })
        })
        this.kbHide = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardIsVisible: false })
        })
        //this.play()
    }
    componentWillUnmount(){
        this.kbShow.remove()
        this.kbHide.remove()
    }
    playAlert = () => {
        const resto = 0
        const { count, time } = this.state
        if(count >= parseInt(time)-5 && count <= parseInt(time)){
            this.alert.play()
        }
    }
    restart = () => {
        if(this.state.paused){
            clearInterval(this.countTimer)
            clearInterval(this.countdownTimer)
            this.play()
        }
    }
    back = () => {
        if(this.state.paused || !this.state.isRunning){
            clearInterval(this.countTimer)
            clearInterval(this.countdownTimer)
            this.props.navigation.goBack()
        }
    }
    stop = () => {
        this.setState({
            paused: !this.state.paused
        })
    }
    play = () => {
        this.setState({
            count: 0,
            countdownValue: 5,
            paused: false
        })
        this.setState({ isRunning: true })
        const count = () => {
            if(this.state.paused){
                return;
            }
            this.setState({ count: this.state.count + 1 }, () => {
                this.playAlert()
            })
        }

        this.alert.play()
        this.countdownTimer = setInterval(() => {
            if(this.state.paused){
                return;
            }
            this.alert.play()
            this.setState({ countdownValue: this.state.countdownValue - 1 }, () => {
                if(this.state.countdownValue === 0){
                    clearInterval(this.countdownTimer)
                    this.countTimer = setInterval(count, 1000)
                }
            })
        }, 1000)

    }
    render(){
        if(this.state.isRunning){
            const percMinute = parseInt(((this.state.count)/parseInt(this.state.time))*100)
            const restante = parseInt(this.state.time)>=this.state.count ? parseInt(this.state.time)-this.state.count : 0
            const opacity = !this.state.paused ? 0.6 : 1
            return(
                <BackgroundProgress percentage={percMinute}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{flex: 1}}>
                        <Title title='Isometria' style={{ paddingTop: this.state.keyboardIsVisible ? 20 : 100 }} />
                        </View>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Time time={this.state.count} />
                            <Time time={restante} type='text2' appendedText={' restantes'} />
                        </View>
                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            {
                                this.state.countdownValue > 0 ?
                                <Text style={styles.countdown}>{this.state.countdownValue}</Text>
                                : null
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 40 }}>
                                <TouchableOpacity style={{alignSelf: 'center' }} onPress={this.back}>
                                    <Image style={{opacity}} source={require('../../assets/left-arrow.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignSelf: 'center' }} onPress={this.stop}>
                                    { 
                                        this.state.paused ? 
                                        <Image source={require('../../assets/btn-play.png')} />
                                        : <Image source={require('../../assets/btn-stop.png')} />
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignSelf: 'center' }} onPress={this.restart}>
                                    <Image style={{opacity}} source={require('../../assets/restart.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </BackgroundProgress>
            )
        }
        return(
            <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
                <ScrollView style={styles.container}>
                    <Title title='Isometria' style={{ paddingTop: this.state.keyboardIsVisible ? 20 : 200 }} />
                    <Image style={{ alignSelf: 'center', marginBottom: 17 }} source={require('../../assets/settings-cog.png')} />
                    <Select
                        label='Objetivo:'
                        current={this.state.goal}
                        options={[
                            {
                                id: 0,
                                label: 'livre'
                            }, 
                            {
                                id: 1,
                                label: 'bater tempo'
                            }
                        ]}
                        onSelect={ opt => this.setState({ goal: opt })}
                    />
                    
                    <Text style={styles.label}>Quantos segundos:</Text>
                    <TextInput style={styles.input} keyboardType='numeric' value={this.state.time} onChangeText={ text => this.setState({ time: text })} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 40 }}>
                        <TouchableOpacity style={{alignSelf: 'center' }} onPress={this.back}>
                            <Image source={require('../../assets/left-arrow.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.play}>
                            <Image source={require('../../assets/btn-play.png')} />
                        </TouchableOpacity>
                        <Text>Testar</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
IsometriaScreen.navigationOptions = {
    header: null
}
const styles = StyleSheet.create({
    container:{ 
        flex: 1, 
        backgroundColor: '#D6304A'
    },
    label:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 24
    },
    input:{
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 48
    },
    countdown: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 144,
        color: 'white',
        textAlign: 'center'
    }
})

export default IsometriaScreen
