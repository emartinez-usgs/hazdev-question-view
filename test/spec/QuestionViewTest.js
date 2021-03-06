/* global describe, it, chai, sinon */
'use strict';

var QuestionView = require('questionview/QuestionView'),
    View = require('mvc/View');


var expect = chai.expect;

var emptyQuestion = QuestionView({
  answers:[
    {
      value:null,
      label:null
    }
  ]
});

var getClickEvent = function () {
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, window, 1, 0, 0);
  return evt;
};
var getChangeEvent = function () {
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', false, true);
  return evt;
};
var getBlurEvent = function () {
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('blur', false, true);
  return evt;
};

describe('QuestionView test suite', function () {
  describe('_initialize()', function () {
    it('Is defined', function () {
      expect(typeof QuestionView).to.equal('function');
    });

    it('Sets options on itself.', function () {
      expect(emptyQuestion).to.be.an.instanceof(Object);
    });

    it('Can be required.', function () {
      /* jshint -W030 */
      expect(QuestionView).to.not.be.null;
      /* jshint +W030 */
    });

    it('Has all expected public methods.', function () {
      expect(emptyQuestion).to.respondTo('clearAnswers');
      expect(emptyQuestion).to.respondTo('destroy');
      expect(emptyQuestion).to.respondTo('getAnswers');
      expect(emptyQuestion).to.respondTo('selectAnswers');
      expect(emptyQuestion).to.respondTo('setAnswers');
    });

    it('Has proper default attributes.', function () {
      /* jshint -W030 */
      expect(emptyQuestion.el).to.not.be.null;
      expect(emptyQuestion.label).to.not.be.null;
      expect(emptyQuestion.answers).to.not.be.null;
      expect(emptyQuestion.multiSelect).to.not.be.null;
      /* jshint +W030 */
    });

  });

  describe('_onChange()', function () {

    it('Enables "other" input when selected.', function () {

      var question = QuestionView({
        label:'This one uses an "other" box',
        multiSelect:false,
        answers:[
          {
            value:'first-answer',
            label:'Some answer'
          },
          {
            value:'second-answer',
            label:'Another answer',
            otherValue:'Please specify...',
            otherLabel:'Other:'
          }
        ]
      });

      var answerList = question.el.querySelector('fieldset'),
          answerElement = answerList.getElementsByTagName('li'),
          inputs = answerElement[1].getElementsByTagName('input');

      expect(inputs[1].disabled).to.equal(true);
      inputs[0].checked = true;
      inputs[0].dispatchEvent(getChangeEvent());
      expect(inputs[1].disabled).to.equal(false);
    });

    it('Disables "other" input when de-selected.', function () {
      var question = QuestionView({
        label:'This one uses an "other" box',
        multiSelect:false,
        answers:[
          {
            value:'first-answer',
            label:'Some answer'
          },
          {
            value:'second-answer',
            label:'Another answer',
            otherValue:'Please specify...',
            otherLabel:'Other:'
          }
        ]
      });
      var answerList = question.el.querySelector('fieldset'),
          answerElement = answerList.getElementsByTagName('li'),
          inputs = answerElement[1].getElementsByTagName('input');

      expect(inputs[1].disabled).to.equal(true);
      inputs[0].checked = false;
      inputs[0].dispatchEvent(getChangeEvent());
      expect(inputs[1].disabled).to.equal(true);
    });

  });

  describe('_onBlur()', function () {

    it('Triggers change event when value has changed.', function () {
      var spy = sinon.spy();
      var question = QuestionView({
        label:'This one uses an "other" box',
        multiSelect:false,
        selectedAnswer:'second-answer',
        answers:[
          {
            value:'first-answer',
            label:'Some answer'
          },
          {
            value:'second-answer',
            label:'Another answer',
            otherValue:'Please specify...',
            otherLabel:'Other:'
          }
        ]
      });
      var answerList = question.el.querySelector('fieldset'),
          answerElement = answerList.getElementsByTagName('li'),
          inputs = answerElement[1].getElementsByTagName('input');

      question.on('change', spy);
      inputs[1].value = 'dont say anything';
      inputs[1].dispatchEvent(getBlurEvent());
      expect(spy.callCount).to.equal(1);

      inputs[1].dispatchEvent(getBlurEvent());
      expect(spy.callCount).to.equal(1);

      inputs[1].value = 'yes, 20';
      inputs[1].dispatchEvent(getBlurEvent());
      expect(spy.callCount).to.equal(2);
    });
  });

  describe('getAnswers()', function () {
    var question1 = QuestionView({
      label:'This one uses an "other" box',
      multiSelect:false,
      selectedAnswer:'second-answer',
      answers:[
        {
          value:'first-answer',
          label:'Some answer'
        },
        {
          value:'second-answer',
          label:'Another answer',
          otherValue:'Please specify...',
          otherLabel:'Other:'
        }
      ]
    });
    var question2 = QuestionView({
      label:'These ones are in a div',
      multiSelect:true,
      selectedAnswer:[
        'second-answer',
        'fourth-answer'
      ],
      answers:[
        {
          value:'first-answer',
          label:'#1'
        },
        {
          value:'second-answer',
          label:'#2'
        },
        {
          value:'third-answer',
          label:'#3'
        },
        {
          value:'fourth-answer',
          label:'#4'
        },
        {
          value:'fifth-answer',
          label:'#5'
        }
      ]
    });

    it('Returns the appropriate answer, if there is only 1.', function () {
      expect(question1.getAnswers().value).to.equal('second-answer');
      expect(question1.getAnswers().label).to.equal('Another answer');
      expect(question1.getAnswers().otherValue).to.equal('Please specify...');
      expect(question1.getAnswers().otherLabel).to.equal('Other:');
    });
    it('Returns the appropriate answers, if there are many.', function () {
      expect(question2.getAnswers()[0].value).to.equal('second-answer');
      expect(question2.getAnswers()[0].label).to.equal('#2');
      expect(question2.getAnswers()[1].value).to.equal('fourth-answer');
      expect(question2.getAnswers()[1].label).to.equal('#4');
    });

  });

  describe('setAnswers()', function () {
    var question1 = QuestionView({
      label:'This one uses an "other" box',
      multiSelect:false,
      answers:[
        {
          value:'first-answer',
          label:'Some answer'
        },
        {
          value:'second-answer',
          label:'Another answer',
          otherValue:'Please specify...',
          otherLabel:'Other:'
        }
      ]
    });
    var question2 = QuestionView({
      label:'These ones are in a div',
      multiSelect:true,
      answers:[
        {
          value:'first-answer',
          label:'#1'
        },
        {
          value:'second-answer',
          label:'#2'
        },
        {
          value:'third-answer',
          label:'#3'
        },
        {
          value:'fourth-answer',
          label:'#4'
        },
        {
          value:'fifth-answer',
          label:'#5'
        }
      ]
    });

    it('Sets an answer.', function () {
      /* jshint -W030 */
      expect(question1.getAnswers()).to.be.null;
      question1.setAnswers('first-answer');
      expect(question1.getAnswers()).to.not.be.null;
      /* jshint +W030 */
      expect(question1.getAnswers().value).to.equal('first-answer');
      expect(question1.getAnswers().label).to.equal('Some answer');
    });

    it('Sets multiple answers.', function () {
      /* jshint -W030 */
      expect(question2.getAnswers()).to.be.null;
      question2.setAnswers(['second-answer', 'fourth-answer']);
      expect(question2.getAnswers()).to.not.be.null;
      /* jshint +W030 */
      expect(question2.getAnswers()[0].value).to.equal('second-answer');
      expect(question2.getAnswers()[0].label).to.equal('#2');
      expect(question2.getAnswers()[1].value).to.equal('fourth-answer');
      expect(question2.getAnswers()[1].label).to.equal('#4');
    });

  });

});
