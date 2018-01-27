export enum EEventEmitterStatus{
    CANCELED
}

export interface IEventSubscribe{
    ref:string;
    cancel?:Function;
}

export interface IEventEmitterError{
    error:string;
    status:EEventEmitterStatus;    
}
interface IEventSubscribeExtended<GEmitType, GErrorType , GResolveType> extends IEventSubscribe{
    handlerSucess: (result:GEmitType) => GResolveType;
    handlerError?: (result:GErrorType) => any;
    once?: boolean;
}

export interface IConfigEmitter{}

export class EventInsc implements IEventSubscribe{
    ref:string;
    private eventInst:EventEmitter<any, any>;
    constructor(refid:string, peventEmitter:EventEmitter<any, any>){
        this.ref = refid;
        this.eventInst = peventEmitter;
    }
    cancel():void{
        this.eventInst.unsubscribe(this);
        delete this.eventInst;
    }
}

export class EventEmitter<GEmitType, GErrorType = string, GResolveType = any>{
	private _events:IEventSubscribeExtended<GEmitType, GErrorType, GResolveType>[];
    private _next_iterator:number;
    private _cancel_next:boolean;
    private _lastvalue:GEmitType;
    private config:IConfigEmitter;

	constructor(config:IConfigEmitter = {}){
	    this.config = config;
        this._next_iterator=0;
        this._cancel_next = false;
	}
    public get emittedValue():GEmitType{
        return this._lastvalue;
    }
    public error(err:GErrorType){
        if(this.hasSubscribers()){
            this._events.forEach(_sub => {
                if(_sub.handlerError){
                   _sub.handlerError(err);    
                }
            });
        }
    }
	public emit(value: GEmitType):GResolveType[]{
        let hasCancel:boolean = this._cancel_next;
        let _resolveValues:GResolveType[] = [];
        if (hasCancel) {
            this._cancel_next = false;            
        }else if(this.hasSubscribers()){
            let _toremove:IEventSubscribe[] = [];
            hasCancel = !this._events.every(_sub => {                
                _resolveValues.push(
                    _sub.handlerSucess(value)
                );
                if(_sub.once){                    
                    _toremove.push({ref:_sub.ref});
                };
                if(this._cancel_next){
                    this._cancel_next = false;
                    return false;
                };                
                return true;
            });            
            _toremove.forEach(_subref => this.unsubscribe(_subref));           
        };	
	this._lastvalue = value;
        return _resolveValues;
	}
	private next(value:GEmitType):void{
        if(this.hasSubscribers()){
            this._events[this._next_iterator].handlerSucess(value);
            this._next_iterator++;  
        };
    }
    private getRefId():string{
        return new Date().getTime() + "#" + this._events.length;
    }
    public subscribe(handlerSucess:(value:GEmitType) => any, handlerError?:(value:GErrorType) => any): IEventSubscribe {
        if(!this._events){
            this._events = [];
        };
        let ref:string = this.getRefId();
        this._events.push({ ref, handlerSucess, handlerError});
        return new EventInsc(ref,this);
    }
    public once(handlerSucess:(value:GEmitType) => any, handlerError?:(value:GErrorType) => any): IEventSubscribe {
        if (!this._events) {
            this._events = [];
        };
        let ref: string = this.getRefId();
        this._events.push({ ref , handlerSucess , handlerError ,once:true });
        return new EventInsc(ref,this);
    }
    public hasSubscribers():boolean{
        if(this._events){
            return this._events.length > 0;
        };
        return false;
    }
    public unsubscribeAll(): void {
       this._events=[];
    }
    public cancel():void{
        this._cancel_next = true;
    }
    public unsubscribe(subscribe:IEventSubscribe):void{
        if(this.hasSubscribers()){
            let indx:number = -1; 
            this._events.every((p_sub, p_indx:number)=>{
                if(p_sub.ref === subscribe.ref){
                    indx = p_indx;
                    return false;
                };
                return true;
            });        
            if(indx >- 1){
                this._events.splice(indx,1);
            }
        }   

    }
}
