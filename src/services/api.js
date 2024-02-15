import examData from '../Exams/exam1.json';

export async function getToken() {
  const response = await fetch('https://opentdb.com/api_token.php?command=request');
  const data = await response.json();
  return data;
}

export function getQuestionsFromLocalFile(examId, usedQuestionIds = []) {
  try {
    // Importe o arquivo JSON local com as questões
    // const examData = require('../Exams/exam1.json');
    // Filtra as questões que ainda não foram utilizadas
    const unusedQuestions = examData[0].questions
      .filter((question) => !usedQuestionIds.includes(question.questionId));
    // Verifica se há questões não utilizadas
    if (unusedQuestions.length === 0) {
      console.warn('Voce fez todas as questões.');
      // Reinicia a lista de IDs de questões utilizadas
      usedQuestionIds.length = 0;
    }
    // Escolhe aleatoriamente uma questão não utilizada
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const selectedQuestion = unusedQuestions[randomIndex];
    // Adiciona o ID da questão escolhida à lista de IDs de questões utilizadas
    usedQuestionIds.push(selectedQuestion.questionId);
    // Separa as respostas corretas e incorretas
    const { rightAnswer, alternatives, ...restOfQuestion } = selectedQuestion;
    const { questionId, question, image } = restOfQuestion;
    // Mapeia as alternativas para o formato desejado
    const formattedAlternatives = alternatives.map((alternative) => ({
      id: alternative.id,
      description: alternative.description,
    }));
    // Encontra a resposta correta com base no ID
    const correctAnswer = formattedAlternatives
      .find((alternative) => alternative.id === rightAnswer);
    // Filtra as alternativas corretas e incorretas
    const incorrectAnswers = formattedAlternatives
      .filter((alternative) => alternative !== correctAnswer);
    // Retorna a questão no formato desejado
    const result = {
      results: [{
        questionId,
        question,
        correctAnswer: correctAnswer ? correctAnswer.description : '',
        incorrectAnswers: incorrectAnswers.map((alternative) => alternative.description),
        image: image || '',
        usedQuestionIds,
      }],
    };

    return result;
  } catch (error) {
    console.error('Erro ao obter as questões:', error);
    throw error;
  }
}
