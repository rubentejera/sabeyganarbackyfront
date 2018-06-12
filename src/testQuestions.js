export default function testQuestions() {
    function getQuestions() {
        return [
            {
                id: 10,
                title: 'Foo',
                answers: [
                    {id: 0, answer: '25'},
                    {id: 1, answer: '33'},
                    {id: 2, answer: '37'}
                ],
                correctAnswer: {id: 2}
            },
            {
                id: 11,
                title: 'Pero que dices muchacho?',
                answers: [
                    {id: 0, answer: 'Lusaka'},
                    {id: 1, answer: 'Harare'},
                    {id: 2, answer: 'Canarias'}
                ],
                correctAnswer: {id: 2}
            },
            {
                id: 12,
                title: 'Nombre de Colón?',
                answers: [
                    {id: 0, answer: 'Cristobal'},
                    {id: 1, answer: 'Santiago'},
                    {id: 2, answer: 'Pepito'}
                ],
                correctAnswer: {id: 0}
            }
        ];
    }
    return {
        getQuestions
    }
}