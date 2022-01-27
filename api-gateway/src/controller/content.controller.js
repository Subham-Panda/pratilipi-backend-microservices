const Queues = require('../enum/queues');
const catchAsync = require('../util/catchAsync.util');
const QueueUtil = require('../util/queue.util');

exports.getContent = catchAsync(async (req, res, next) => {
    const { filter } = req.body;

    await QueueUtil.sendMessageToQueue(
        res, Queues.CONTENT_READ, {}, {}, { filter },
    );

});

exports.createContent = catchAsync(async (req, res, next) => {
    const { title, story } = req.body;

    await QueueUtil.sendMessageToQueue(
        res, Queues.CONTENT_CREATE, {}, {}, { title, story },
    );

});

exports.updateContent = catchAsync(async (req, res, next) => {
    const { filter, update } = req.body;

    await QueueUtil.sendMessageToQueue(
        res, Queues.CONTENT_UPDATE, {}, {}, { filter, update },
    );

});

exports.deleteContent = catchAsync(async (req, res, next) => {
    const { filter } = req.body;

    await QueueUtil.sendMessageToQueue(
        res, Queues.CONTENT_DELETE, {}, {}, { filter },
    );

});
