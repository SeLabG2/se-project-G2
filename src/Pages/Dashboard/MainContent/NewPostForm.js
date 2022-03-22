import React from 'react';

function NewPostForm() {

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <>
            <div>NewPostForm</div>
            <div className='newpost_form_wrapper'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Post type :</p>
                        <input type="radio" id="question" name="post_type" value="question" />
                        <label htmlFor="question">Question</label>
                        <input type="radio" id="poll" name="post_type" value="question" />
                        <label htmlFor="poll">Poll</label>
                        <input type="radio" id="note" name="post_type" value="question" />
                        <label htmlFor="note">Note</label>
                    </div>
                    <div>
                        <p>Select Discussion :</p>
                        <input list="browsers" name="browser" />
                        <datalist id="browsers">
                            <option value="Internet Explorer" />
                            <option value="Firefox" />
                            <option value="Chrome" />
                            <option value="Opera" />
                            <option value="Safari" />
                        </datalist>
                    </div>
                    <div>
                        <p>Summary :</p>
                        <input type="text" placeholder="Enter the summary here" />
                    </div>
                    <div>
                        <p>Details :</p>
                        <textarea name="post_details" cols="30" rows="10" placeholder="Enter the details here"></textarea>
                    </div>
                    <div>
                        <p>Show my name as :</p>
                        <select name="anonymity">
                            <option value="volvo">Volvo</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}

export default NewPostForm;