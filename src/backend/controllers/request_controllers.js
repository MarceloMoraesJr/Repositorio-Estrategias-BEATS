const request_services = require('../services/request_services');

const request_state_descriptions = [
    [   //Edit Request (Not implemented in this MVP)
        "Waiting for Administrator Approval",
        "Rejected by Administrator",
        "Approved by Administrator",
        "Excluded by User"
    ],
    [   //Add Request
        "Waiting for Administrator Approval",
        "Rejected by Administrator",
        "Approved by Administrator. Council voting ongoing",
        "Review suggested by Council",
        "Approved by Council. Published",
        "Rejected by Council",
        "Excluded by User"
    ]
];



module.exports = class request_controllers{
    static async postAddRequestInsertDB(req, res, next){
        req.request_inserted = await request_services.insertAddRequest(req.user_info.username);
        next();
    }



    static async postAddRequestSaveJSON(req, res, next){
        const proposed_strategy = {};
        const strategy_fields = [
            'name', 'type', 'aliases', 
            'c', 'i', 'a', 'authn', 'authz', 'acc', 'nr',
            'problem', 'context', 'forces', 'solution',
            'rationale', 'consequences', 'examples',
            'related strategies', 'complementary references'
        ];

        strategy_fields.forEach((field) => {
            if(req.body[field] != undefined){
                proposed_strategy[field] = req.body[field];
            }
            else{
                proposed_strategy[field] = "not given";
            }
        });
        
        const n_protocol = req.request_inserted.protocol_number;
        await request_services.insertAddRequestForm(n_protocol, proposed_strategy);

        res.status(201).send({
            message: "success: strategy add request done",
            ...req.request_inserted,
            state_description: request_state_descriptions[1][0],
            proposed_strategy
        });
    }
}