import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        display: "flex",
        marginBottom: 20,
        borderBottomColor: "#e5e5e5",
        borderBottomWidth: 3,
        padding: 20
    },
    upperRow: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 15
    },
    nameTag: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 5,
        fontWeight: "bold",
    },
    nickName: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 20
    },
    seperator: {
        marginTop: 10,
    },
    rnk: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: 10,
        fontWeight: "bold",
    },
    scoreContainer: {
        display: "flex",
        borderTopColor: "#FAFAFA",
        borderTopWidth: 2,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    score: {
        color: "#00BFA5",
        fontWeight: "bold",
        marginLeft: 5
    }
});

const {
    container,
    upperRow,
    nameTag,
    nickName,
    rnk,
    scoreContainer,
    seperator,
    score
} = styles;


const ScoreCard = ({ nick_name, score, rank }) => {
    return (
        <View style={container}>

            <View style={upperRow}>
                <Text style={nameTag}>NAME</Text>
                <Text style={seperator}>|</Text>
                <Text style={nickName}>{nick_name}</Text>
                <Text style={rnk}>RANK: {rank}
                </Text>
            </View>

            <View style={scoreContainer}>

                <Text>Score:
                     <Text style={score}> {score}</Text>
                </Text>

            </View>

        </View>
    );
}

export default ScoreCard;