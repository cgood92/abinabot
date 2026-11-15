// Sunday Primary Review Script + Additional Songs
const DEFAULT_SCRIPTS = [
    {
        id: "sunday-review-special",
        title: "⭐ This Sunday: Review Sunday (I Lived in Heaven & Christmas Bells)",
        description: "Complete 20-minute interactive review script for Primary Singing Time",
        steps: [
            {
                id: "step-01",
                speaker: "teacher",
                text: "Hey guys! Today, I don't know if you know this or not, but I am a computer programmer—I work in AI and help make robots and computer stuff! Well, I made a really special robot named Abinabot, and he wanted to come to Primary today. Can you guys please help me welcome Abinabot?",
                keyword: "welcome, abinabot",
                gesture: "idle"
            },
            {
                id: "step-02",
                speaker: "robot",
                text: "Hello kids! How are you doing today?",
                audioFile: "audio/clip-01-hello.wav",
                gesture: "wave"
            },
            {
                id: "step-03",
                speaker: "teacher",
                text: "Abinabot, these kids look excited to meet you! Do you want to introduce yourself to these kids a little bit?",
                keyword: "introduce, yourself",
                gesture: "listen"
            },
            {
                id: "step-04",
                speaker: "robot",
                text: "Sure! My name is Abinabot. I was named after Abinadi in the Book of Mormon—it's a great story! My dream is to grow up to be a Primary piano player.",
                audioFile: "audio/clip-02-intro.wav",
                gesture: "raise-right"
            },
            {
                id: "step-05",
                speaker: "teacher",
                text: "Oh yeah, that's way cool! Well, let's see here—maybe one more thing before we sing. Tell the kids: what did you dress up as for Halloween?",
                keyword: "halloween, dressed",
                gesture: "listen"
            },
            {
                id: "step-06",
                speaker: "robot",
                text: "I dressed up as Bishop Wooten for Halloween!",
                audioFile: "audio/clip-03-halloween.wav",
                gesture: "both-arms-up"
            },
            {
                id: "step-07",
                speaker: "teacher",
                text: "Oh, that's hilarious! Nicely done, nicely done. All right, Abinabot, I think we'd better get going here—we have a lot to cover. Today we're practicing the song 'I Lived in Heaven'. Do you know that song?",
                keyword: "heaven, know",
                gesture: "listen"
            },
            {
                id: "step-08",
                speaker: "robot",
                text: "Oh yes, I love that song! Hmm-hmm-hmm-hmm, hmm-hmm-hmm-hmm! Do you need a reminder of the words?",
                audioFile: "audio/clip-04-hum.wav",
                gesture: "singing"
            },
            {
                id: "step-09",
                speaker: "teacher",
                text: "Sure! I haven't sung it for a little while.",
                keyword: "sure, while, reminder",
                gesture: "listen"
            },
            // VERSE 1 TEACHING (One card at a time, Abinabot points & teaches!)
            {
                id: "step-10",
                speaker: "robot",
                text: "I lived in heaven a long time ago, it is true;",
                audioFile: "audio/clip-05-v1-1.wav",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v1-1", badge: "Verse 1 • Line 1" }
            },
            {
                id: "step-11",
                speaker: "robot",
                text: "Lived there and loved there with people I know. So did you.",
                audioFile: "audio/clip-06-v1-2.wav",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v1-2", badge: "Verse 1 • Line 2" }
            },
            {
                id: "step-12",
                speaker: "robot",
                text: "Then Heav’nly Father presented a beautiful plan,",
                audioFile: "audio/clip-07-v1-3.wav",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v1-3", badge: "Verse 1 • Line 3" }
            },
            {
                id: "step-13",
                speaker: "robot",
                text: "All about earth and eternal salvation for man.",
                audioFile: "audio/clip-08-v1-4.wav",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v1-4", badge: "Verse 1 • Line 4" }
            },
            // VERSE 1 SING-ALONG (All 4 pictures + words visible while kids sing!)
            {
                id: "step-14",
                speaker: "teacher",
                text: "Thanks Abinabot! Thanks for that reminder. Kids, are you ready to sing it? Let's sing Verse 1 together!",
                keyword: "sounded, how",
                gesture: "conduct",
                visualCard: {
                    type: "grid",
                    ids: ["heaven-v1-1", "heaven-v1-2", "heaven-v1-3", "heaven-v1-4"],
                    title: "I Lived in Heaven • Verse 1"
                }
            },
            {
                id: "step-15",
                speaker: "teacher",
                text: "Abinabot, how do you think they sounded?",
                keyword: "sounded, think",
                gesture: "listen"
            },
            {
                id: "step-16",
                speaker: "robot",
                text: "They sounded pretty good! Should we go to verse two?",
                audioFile: "audio/clip-09-v2-ask.wav",
                gesture: "raise-right"
            },
            {
                id: "step-17",
                speaker: "teacher",
                text: "Sure! Since you taught verse one, I'll teach verse two!",
                keyword: "verse, two",
                gesture: "listen"
            },
            // VERSE 2 TEACHING (Teacher walks through the 4 pictures + words!)
            {
                id: "step-18",
                speaker: "teacher",
                text: "Father said he needed someone who had enough love",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v2-1", badge: "Verse 2 • Line 1" }
            },
            {
                id: "step-19",
                speaker: "teacher",
                text: "To give his life so we all could return there above.",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v2-2", badge: "Verse 2 • Line 2" }
            },
            {
                id: "step-20",
                speaker: "teacher",
                text: "There was another who sought for the honor divine.",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v2-3", badge: "Verse 2 • Line 3" }
            },
            {
                id: "step-21",
                speaker: "teacher",
                text: "Jesus said, “Father, send me, and the glory be thine.”",
                gesture: "point",
                visualCard: { type: "single", id: "heaven-v2-4", badge: "Verse 2 • Line 4" }
            },
            // VERSE 2 SING-ALONG
            {
                id: "step-22",
                speaker: "teacher",
                text: "Okay Primary, let's sing Verse 2 together!",
                keyword: "sound, did",
                gesture: "conduct",
                visualCard: {
                    type: "grid",
                    ids: ["heaven-v2-1", "heaven-v2-2", "heaven-v2-3", "heaven-v2-4"],
                    title: "I Lived in Heaven • Verse 2"
                }
            },
            {
                id: "step-23",
                speaker: "teacher",
                text: "Abinabot, how did they sound?",
                keyword: "sound",
                gesture: "listen"
            },
            {
                id: "step-24",
                speaker: "robot",
                text: "They sounded positively ELECTRIFYING! It totally SPARKED my circuits and CHARGED up my batteries!",
                audioFile: "audio/clip-10-joke.wav",
                gesture: "jump"
            },
            {
                id: "step-25",
                speaker: "teacher",
                text: "Oh, Abinabot... that was silly.",
                keyword: "silly",
                gesture: "listen"
            },
            {
                id: "step-26",
                speaker: "robot",
                text: "Yeah. It really was.",
                audioFile: "audio/clip-11-facepalm.wav",
                gesture: "facepalm"
            },
            // SONG 2: CHRISTMAS BELLS ARE RINGING (Page 54)
            {
                id: "step-27",
                speaker: "teacher",
                text: "Okay! Now it's time to go to our next song: 'Christmas Bells Are Ringing'! Abinabot, can you help remind us of the words?",
                keyword: "bells, christmas, ringing",
                gesture: "listen"
            },
            {
                id: "step-28",
                speaker: "robot",
                text: "Christmas bells are ringing.",
                audioFile: "audio/clip-12-bells-1.wav",
                gesture: "point",
                visualCard: { type: "single", id: "bells-1", badge: "Christmas Bells • 1" }
            },
            {
                id: "step-29",
                speaker: "robot",
                text: "Hear what they say to you:",
                audioFile: "audio/clip-13-bells-2.wav",
                gesture: "point",
                visualCard: { type: "single", id: "bells-2", badge: "Christmas Bells • 2" }
            },
            {
                id: "step-30",
                speaker: "robot",
                text: "Jesus is born in Bethlehem,",
                audioFile: "audio/clip-14-bells-3.wav",
                gesture: "point",
                visualCard: { type: "single", id: "bells-3", badge: "Christmas Bells • 3" }
            },
            {
                id: "step-31",
                speaker: "robot",
                text: "in Bethlehem.",
                audioFile: "audio/clip-15-bells-4.wav",
                gesture: "point",
                visualCard: { type: "single", id: "bells-4", badge: "Christmas Bells • 4" }
            },
            // SING CHRISTMAS BELLS (All 4 cards visible, teacher leads with bells & actions!)
            {
                id: "step-32",
                speaker: "teacher",
                text: "Okay kids, are you ready to sing it with our bells and actions? All right, let's do it!",
                keyword: "wrap, last",
                gesture: "singing",
                visualCard: {
                    type: "grid",
                    ids: ["bells-1", "bells-2", "bells-3", "bells-4"],
                    title: "Christmas Bells Are Ringing (p. 54)"
                }
            },
            // WRAP UP & GOODBYE
            {
                id: "step-33",
                speaker: "teacher",
                text: "Okay, Abinabot, it's time to wrap up. Is there anything last that you want to say to the kids?",
                keyword: "wrap, last, say",
                gesture: "listen"
            },
            {
                id: "step-34",
                speaker: "robot",
                text: "Oh, I wish I could be there for the Christmas program, but from what I've heard today, you guys will sound great!",
                audioFile: "audio/clip-16-closing.wav",
                gesture: "both-arms-up"
            },
            {
                id: "step-35",
                speaker: "teacher",
                text: "[Bear your brief testimony] ... Everyone, let's say goodbye to Abinabot!",
                keyword: "goodbye, bye",
                gesture: "listen"
            },
            {
                id: "step-36",
                speaker: "robot",
                text: "Goodbye Primary! Keep singing!",
                audioFile: "audio/clip-17-goodbye.wav",
                gesture: "wave"
            }
        ]
    },
    {
        id: "child-of-god",
        title: "I Am a Child of God (General Banter)",
        description: "Back-and-forth friendly lyric teaching for Verse 1",
        steps: [
            {
                speaker: "robot",
                text: "BEEP BOOP! Hello Primary boys and girls! My name is Abinabot! I am so excited to sing with you today!",
                gesture: "wave"
            },
            {
                speaker: "teacher",
                text: "Welcome Abinabot! The children and I are learning our favorite song today. Do you know it?",
                keyword: "know, favorite, song",
                gesture: "listen"
            },
            {
                speaker: "robot",
                text: "ACCESSING MEMORY BANKS... Is it... 'I Am a Child of God'?",
                gesture: "think"
            },
            {
                speaker: "teacher",
                text: "That's it! Let's teach them the very first line!",
                keyword: "start, first, line",
                gesture: "listen"
            },
            {
                speaker: "robot",
                text: "I am a child of God, and He has sent me here!",
                gesture: "conduct"
            },
            {
                speaker: "teacher",
                text: "Primary, let's sing that line together with Abinabot! Ready, go!",
                keyword: "sing, ready, together",
                gesture: "listen"
            },
            {
                speaker: "robot",
                text: "HIGH VOLTAGE HARMONY! You sang that with all your hearts!",
                gesture: "both-arms-up"
            }
        ]
    }
];

function loadAllScripts() {
    try {
        const stored = localStorage.getItem('abinabot_custom_scripts');
        if (stored) {
            const parsed = JSON.parse(stored);
            return [...DEFAULT_SCRIPTS, ...parsed];
        }
    } catch (e) {
        console.warn('Could not load stored scripts', e);
    }
    return [...DEFAULT_SCRIPTS];
}
