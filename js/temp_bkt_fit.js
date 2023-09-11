/*
This code draws insights from the pyBKT library:
Badrinath, A., Wang, F., Pardos, Z.A. (2021) pyBKT: An Accessible Python Library of Bayesian Knowledge Tracing Models. In S. Hsiao, & S. Sahebi (Eds.) Proceedings of the 14th International Conference on Educational Data Mining (EDM). Pages 468-474.
@inproceedings{badrinath2021pybkt,
  title={pyBKT: An Accessible Python Library of Bayesian Knowledge Tracing Models},
  author={Badrinath, Anirudhan and Wang, Frederic and Pardos, Zachary},
  booktitle={Proceedings of the 14th International Conference on Educational Data Mining},
  pages={468--474},
  year={2021}
}
https://github.com/CAHLR/pyBKT
 */
function BKT(data, num_fit_initialization) {

    // Define the following variables:
    // num_fit_initialization: The number of iterations in the EM step.
    
    // Input object Data, contains the following attributes:
    // data: a matrix containing sequential checkpoints for all students, with their responses. Each row represents a different subpart, and each column a checkpoint for a student. There are three potential values: {0 = no response or no question asked, 1 = wrong response, 2 = correct response}
    // starts: defines each student's starting column on the data matrix.
    // lengths: defines the number of check point for each student.
    // resources: defines the sequential id of the resources at each checkpoint. Each position in the vector corresponds to the column in the data matrix.
    // stateseqs: this attribute is the true knowledge state for above data and should be left undefined before running the model.
    
    // The output of the model can will be stored in a fitmodel object, containing the following probabilities as attributes:
    // As: the transition probability between the "knowing" and "not knowing" state. Includes both the "learns" and "forgets" probabilities, and their inverse. As creates a separate transition probability for each resource.
    // learns: the probability of transitioning to the "knowing" state given "not known".
    // forgets: the probability of transitioning to the "not knowing" state given "known".
    // prior: the prior probability of "knowing".
    
    // The fitmodel also includes the following emission probabilities:
    // guesses: the probability of guessing correctly, given "not knowing" state.
    // slips: the probability of picking incorrect answer, given "knowing" state.
    
    // Initialize the fitmodel object.
    var fitmodel = {
        As: [],
        learns: [],
        forgets: [],
        prior: 0,
        guesses: [],
        slips: []
    };
    
    // Iterate over the number of fit_initialization iterations.
    for (var i = 0; i < num_fit_initialization; i++) {
    
        // E-step: Estimate the posterior state probabilities.
        var state_probs = estimate_state_probabilities(data, fitmodel);
    
        // M-step: Update the model parameters.
        update_model_parameters(data, state_probs, fitmodel);
    }
    
    // Return the fitmodel object.
    return fitmodel;
}

/*
This estimate_state_probabilities function takes two arguments: data and fitmodel.

The data argument is a matrix containing sequential checkpoints for all students, with their responses. Each row represents a different subpart, and each column a checkpoint for a student. There are three potential values: {0 = no response or no question asked, 1 = wrong response, 2 = correct response}
The fitmodel argument is an object containing the following attributes:

As: the transition probability between the "knowing" and "not knowing" state. Includes both the "learns" and "forgets" probabilities, and their inverse. As creates a separate transition probability for each resource.
learns: the probability of transitioning to the "knowing" state given "not known".
forgets: the probability of transitioning to the "not knowing" state given "known".
prior: the prior probability of "knowing".  If at a checkpoint, a resource was given but no question asked, the associated column would have 0 values in all rows. For example, to set up data containing 5 subparts given to two students over 2-3 checkpoints, the matrix would look as follows:

  | 0  0  0  0  2 |
  | 0  1  0  0  0 |
  | 0  0  0  0  0 |
  | 0  0  0  0  0 |
  | 0  0  2  0  0 |   
In the above example, the first student starts out with just a learning resource, and no checks for understanding. In subsequent checkpoints, this student also responds to subpart 2 and 5, and gets the first wrong and the second correct.

guesses: the probability of guessing correctly, given "not knowing" state.
slips: the probability of picking incorrect answer, given "knowing" state.
The function first initializes the state probabilities to [0.5, 0.5] for each student.

Then, it iterates over the number of subparts. For each subpart, it updates the state probabilities for each student using the following equations:

state_probs[i][0] = (state_probs[i][0] * emission_prob + state_probs[i][1] * (1 - emission_prob)) / (1 - transition_prob)
state_probs[i][1] = (transition_prob * state_probs[i][1] + (1 - transition_prob) * state_probs[i][0]) / (1 - emission_prob)

where:

state_probs[i][0] is the probability of student i being in the "knowing" state after the subpart
state_probs[i][1] is the probability of student i being in the "not knowing" state after the subpart
emission_prob is the probability of student i responding correctly to the subpart, given their state
transition_prob is the probability of student i transitioning from the "knowing" state to the "not knowing" state, given the subpart
Finally, the function returns the state probabilities.
 */
function estimate_state_probabilities(data, fitmodel) {

    // Initialize the state probabilities.
    var state_probs = [];
    for (var i = 0; i < data.length; i++) {
        state_probs[i] = [0.5, 0.5];
    }
    
    // Iterate over the number of subparts.
    for (var j = 0; j < data[0].length; j++) {
    
        // E-step: Update the state probabilities for each student.
        for (var i = 0; i < data.length; i++) {
        var response = data[i][j];
        var resource = fitmodel.resources[j];
        var emission_prob = fitmodel.emissions[resource][response];
        var transition_prob = fitmodel.transitions[resource][state_probs[i][1]];
        state_probs[i] = [
            (state_probs[i][0] * emission_prob + state_probs[i][1] * (1 - emission_prob)) / (1 - transition_prob),
            (transition_prob * state_probs[i][1] + (1 - transition_prob) * state_probs[i][0]) / (1 - emission_prob)
        ];
        }
    }
    
    // Return the state probabilities.
    return state_probs;
}

/*
This function takes three arguments: data, state_probs, and fitmodel.

The data argument is a matrix containing sequential checkpoints for all students, with their responses. Each row represents a different subpart, and each column a checkpoint for a student. There are three potential values: {0 = no response or no question asked, 1 = wrong response, 2 = correct response}
The state_probs argument is an array of arrays containing the posterior state probabilities for each student after each subpart. Each row represents a different student, and each column represents a different subpart.
The fitmodel argument is an object containing the following attributes:
As: the transition probability between the "knowing" and "not knowing" state. Includes both the "learns" and "forgets" probabilities, and their inverse. As creates a separate transition probability for each resource.
learns: the probability of transitioning to the "knowing" state given "not known".
forgets: the probability of transitioning to the "not knowing" state given "known".
prior: the prior probability of "knowing".
guesses: the probability of guessing correctly, given "not knowing" state.
slips: the probability of picking incorrect answer, given "knowing" state.
The function first initializes the model parameters to 0.

Then, it iterates over the number of subparts. For each subpart, it updates the model parameters using the following equations:

response_counts[response] = the number of students who responded correctly to the subpart
state_counts[state] = the number of students who were in the state after the subpart
emission_prob = the probability of responding correctly to the subpart, given the state
transition_prob = the probability of transitioning from the state to the "not knowing" state, given the subpart

where:

response_counts[response] is the number of students who responded correctly to the subpart
state_counts[state] is the number of students who were in the state after the subpart
emission_prob is the probability of responding correctly to the subpart, given the state
transition_prob is the probability of transitioning from the state to the "not knowing" state, given the subpart
Finally, the function updates the fitmodel object with the updated model parameters.
 */
function update_model_parameters(data, state_probs, fitmodel) {

    // Initialize the model parameters.
    var As = [];
    var learns = [];
    var forgets = [];
    var prior = 0;
    var guesses = [];
    var slips = [];
  
    // Iterate over the number of subparts.
    for (var j = 0; j < data[0].length; j++) {
  
      // M-step: Update the model parameters.
      var response_counts = [];
      var state_counts = [];
      for (var i = 0; i < data.length; i++) {
        var response = data[i][j];
        var state = state_probs[i][1];
        response_counts[response]++;
        state_counts[state]++;
      }
      for (var response = 0; response < 3; response++) {
        var emission_prob = response_counts[response] / state_counts[1];
        var transition_prob = (state_counts[0] - response_counts[response]) / state_counts[0];
        As.push(transition_prob);
        learns.push(emission_prob);
        forgets.push(1 - emission_prob);
      }
      prior = state_counts[1] / data.length;
      guesses = [1 - learns[1], learns[1]];
      slips = [1 - forgets[1], forgets[1]];
    }
  
    // Update the fitmodel object.
    fitmodel.As = As;
    fitmodel.learns = learns;
    fitmodel.forgets = forgets;
    fitmodel.prior = prior;
    fitmodel.guesses = guesses;
    fitmodel.slips = slips;
  }

  function jimsimpleBKTInitModel(data) {
    /* This function takes one argument: data--an array of observations 0=incorrect, 1=correct
     * In this simplified model we just set some default probablilities for learns, forgets, guesses, slips
     * Those probabilities are not adjusted to fit the model.
     */

    // Initialize the over simplified model object.
    var model = {
      prior: 0.001,
      transit: .01,
      forgets: .01,
      guesses: .3,
      slips: .1,
      learned: 0
    };
    // Iterate over the observations to update the prior (probablility the skill is known)
    for (var j = 0; j < data.length; j++) {
      if (data[j]=1) {
        model.prior = model.prior * (1-model.slips) / ((model.prior*(1-model.slips) + (1-model.prior)*(model.guesses)));
      } else {
        model.prior = model.prior * model.slips / ((model.prior*model.slips + (1-model.prior)*(1-model.guesses)));
      }
      model.learned = model.prior + ((1-model.prior)*model.transit);
    }
    return model;
  }

  function jimsimpleBKTUpdateModel(observation, model) {
    /* This function takes one argument: observation 0=incorrect, 1=correct
     */
    if (observation==1) {
      model.prior = model.prior * (1-model.slips) / ((model.prior*(1-model.slips) + (1-model.prior)*(model.guesses)));
          } else {
      model.prior = model.prior * model.slips / ((model.prior*model.slips + (1-model.prior)*(1-model.guesses)));
    }
    model.learned = model.prior + ((1-model.prior)*model.transit);
    return model;
  }
